"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSprintDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_sprint_dto_1 = require("./create-sprint.dto");
class UpdateSprintDto extends (0, mapped_types_1.PartialType)(create_sprint_dto_1.CreateSprintDto) {
}
exports.UpdateSprintDto = UpdateSprintDto;
//# sourceMappingURL=update-sprint.dto.js.map