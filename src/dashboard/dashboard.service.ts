import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getData(userId: string) {
    // Check if user owns any company
    const ownedCompanies = await this.prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });

    if (ownedCompanies.length > 0) {
      return this.getAdminDashboard(userId);
    }
    return this.getMemberDashboard(userId);
  }

  private async getAdminDashboard(userId: string) {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const companies = await this.prisma.company.findMany({
      where: { userId },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        projects: {
          include: {
            tasks: {
              select: {
                id: true, title: true, status: true, priority: true,
                type: true, dueDate: true, storyPoints: true,
                assignees: true, sprintId: true, createdAt: true,
              },
            },
            sprints: {
              where: { isActive: true },
              select: { id: true, name: true, startDate: true, endDate: true, isActive: true },
              take: 1,
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate all tasks across all projects
    const allTasks = companies.flatMap((c) => c.projects.flatMap((p) => p.tasks));

    const taskSummary = {
      total: allTasks.length,
      todo: allTasks.filter((t) => t.status === 'TODO').length,
      inProgress: allTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      inReview: allTasks.filter((t) => t.status === 'IN_REVIEW').length,
      done: allTasks.filter((t) => t.status === 'DONE').length,
      blocked: allTasks.filter((t) => t.status === 'BLOCKED').length,
      overdue: allTasks.filter(
        (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE',
      ).length,
    };

    const projectSummary = {
      total: companies.flatMap((c) => c.projects).length,
      planning: companies.flatMap((c) => c.projects).filter((p) => p.status === 'PLANNING').length,
      active: companies.flatMap((c) => c.projects).filter((p) => p.status === 'IN_PROGRESS').length,
      completed: companies.flatMap((c) => c.projects).filter((p) => p.status === 'COMPLETED').length,
      onHold: companies.flatMap((c) => c.projects).filter((p) => p.status === 'ON_HOLD').length,
    };

    const teamMemberIds = new Set(
      companies.flatMap((c) => c.members.map((m) => m.userId)),
    );

    const activeSprints = companies.flatMap((c) =>
      c.projects.flatMap((p) =>
        p.sprints.map((s) => ({ ...s, projectName: p.name, companyName: c.name })),
      ),
    );

    const overdueTasks = allTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 8)
      .map((t) => {
        const project = companies.flatMap((c) => c.projects).find((p) =>
          p.tasks.some((tk) => tk.id === t.id),
        );
        return { ...t, projectName: project?.name, companyName: companies.find((c) => c.projects.some((p) => p.id === project?.id))?.name };
      });

    const upcomingDeadlines = allTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= in7Days && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 8)
      .map((t) => {
        const project = companies.flatMap((c) => c.projects).find((p) =>
          p.tasks.some((tk) => tk.id === t.id),
        );
        return { ...t, projectName: project?.name, companyName: companies.find((c) => c.projects.some((p) => p.id === project?.id))?.name };
      });

    // Per-company breakdown
    const companyBreakdown = companies.map((c) => {
      const cTasks = c.projects.flatMap((p) => p.tasks);
      return {
        id: c.id,
        name: c.name,
        color: c.color,
        memberCount: c.members.length,
        projectCount: c.projects.length,
        members: c.members.map((m) => ({ id: m.userId, name: m.user.name, email: m.user.email, role: m.role })),
        projects: c.projects.map((p) => ({
          id: p.id, name: p.name, status: p.status, color: p.color,
          activeSprint: p.sprints[0] ?? null,
          taskCounts: {
            total: p.tasks.length,
            todo: p.tasks.filter((t) => t.status === 'TODO').length,
            inProgress: p.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
            done: p.tasks.filter((t) => t.status === 'DONE').length,
            blocked: p.tasks.filter((t) => t.status === 'BLOCKED').length,
          },
        })),
        taskCounts: {
          total: cTasks.length,
          todo: cTasks.filter((t) => t.status === 'TODO').length,
          inProgress: cTasks.filter((t) => t.status === 'IN_PROGRESS').length,
          done: cTasks.filter((t) => t.status === 'DONE').length,
          blocked: cTasks.filter((t) => t.status === 'BLOCKED').length,
          overdue: cTasks.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE').length,
        },
      };
    });

    return {
      role: 'admin',
      summary: {
        companies: companies.length,
        teamMembers: teamMemberIds.size,
        projects: projectSummary,
        tasks: taskSummary,
        activeSprints: activeSprints.length,
      },
      companyBreakdown,
      activeSprints,
      overdueTasks,
      upcomingDeadlines,
    };
  }

  private async getMemberDashboard(userId: string) {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Find companies user is a member of
    const memberships = await this.prisma.companyMember.findMany({
      where: { userId },
      include: {
        company: {
          include: {
            projects: {
              include: {
                tasks: {
                  select: {
                    id: true, title: true, status: true, priority: true,
                    type: true, dueDate: true, storyPoints: true,
                    assignees: true, sprintId: true, createdAt: true, updatedAt: true,
                  },
                },
                sprints: {
                  where: { isActive: true },
                  select: { id: true, name: true, startDate: true, endDate: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    const allProjects = memberships.flatMap((m) => m.company.projects);
    const allTasks = allProjects.flatMap((p) => p.tasks);

    // Filter tasks where current user is in assignees JSON
    const myTasks = allTasks.filter((t) => {
      const assignees = t.assignees as { userId?: string }[] | null;
      return assignees?.some((a) => a.userId === userId);
    });

    const taskSummary = {
      total: myTasks.length,
      todo: myTasks.filter((t) => t.status === 'TODO').length,
      inProgress: myTasks.filter((t) => t.status === 'IN_PROGRESS').length,
      inReview: myTasks.filter((t) => t.status === 'IN_REVIEW').length,
      done: myTasks.filter((t) => t.status === 'DONE').length,
      blocked: myTasks.filter((t) => t.status === 'BLOCKED').length,
    };

    const storyPointsDone = myTasks
      .filter((t) => t.status === 'DONE' && t.storyPoints)
      .reduce((sum, t) => sum + (t.storyPoints ?? 0), 0);
    const storyPointsTotal = myTasks
      .filter((t) => t.storyPoints)
      .reduce((sum, t) => sum + (t.storyPoints ?? 0), 0);

    const upcomingDeadlines = myTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= in7Days && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 8)
      .map((t) => {
        const proj = allProjects.find((p) => p.tasks.some((tk) => tk.id === t.id));
        return { ...t, projectName: proj?.name, companyName: memberships.find((m) => m.company.projects.some((p) => p.id === proj?.id))?.company.name };
      });

    const overdueTasks = myTasks
      .filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 8)
      .map((t) => {
        const proj = allProjects.find((p) => p.tasks.some((tk) => tk.id === t.id));
        return { ...t, projectName: proj?.name, companyName: memberships.find((m) => m.company.projects.some((p) => p.id === proj?.id))?.company.name };
      });

    const activeSprints = allProjects
      .flatMap((p) => p.sprints.map((s) => ({ ...s, projectName: p.name })))
      .filter((s, idx, arr) => arr.findIndex((x) => x.id === s.id) === idx);

    const recentWork = [...myTasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 6)
      .map((t) => {
        const proj = allProjects.find((p) => p.tasks.some((tk) => tk.id === t.id));
        return { ...t, projectName: proj?.name };
      });

    const projectBreakdown = allProjects.map((p) => {
      const pMyTasks = p.tasks.filter((t) => {
        const assignees = t.assignees as { userId?: string }[] | null;
        return assignees?.some((a) => a.userId === userId);
      });
      const company = memberships.find((m) => m.company.projects.some((pr) => pr.id === p.id))?.company;
      return {
        id: p.id, name: p.name, status: p.status, color: p.color,
        companyName: company?.name,
        activeSprint: p.sprints[0] ?? null,
        myTaskCounts: {
          total: pMyTasks.length,
          todo: pMyTasks.filter((t) => t.status === 'TODO').length,
          inProgress: pMyTasks.filter((t) => t.status === 'IN_PROGRESS').length,
          done: pMyTasks.filter((t) => t.status === 'DONE').length,
        },
      };
    });

    return {
      role: 'member',
      summary: {
        projects: allProjects.length,
        companies: memberships.length,
        tasks: taskSummary,
        storyPoints: { done: storyPointsDone, total: storyPointsTotal },
        activeSprints: activeSprints.length,
      },
      projectBreakdown,
      activeSprints,
      recentWork,
      upcomingDeadlines,
      overdueTasks,
    };
  }
}
