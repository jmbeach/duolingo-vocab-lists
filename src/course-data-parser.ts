import { CourseData, ParsedCourse, ParsedSkill } from './interfaces.ts';

class CourseDataParser {
  courseData: CourseData;
  constructor(courseData: CourseData) {
    this.courseData = courseData;
  }

  parse(): ParsedCourse {
    const sections = this.courseData.currentCourse.sections;
    const units = this.courseData.currentCourse.path;
    let rowCount = 0;
    const result: ParsedCourse = {
      skills: {
        list: [],
        byId: {},
        byUrl: {},
      },
    };
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionNumber = i + 1;
      const endRow =
        i === sections.length - 1
          ? this.courseData.currentCourse.skills.length
          : rowCount + section.numRows;
      for (let row = rowCount; row < endRow; row++) {
        const skillRow = this.courseData.currentCourse.skills[row];
        for (const { id, name, shortName, urlName } of skillRow) {
          const parsedSkill: ParsedSkill = {
            id,
            name,
            sectionNumber,
            shortName,
            urlName,
            levelNumber: -1,
            unitNumber: -1,
          };
          result.skills.byId[id] = parsedSkill;
          result.skills.byUrl[urlName] = parsedSkill;
          result.skills.list.push(parsedSkill);
        }
      }
      rowCount += section.numRows;
    }

    for (const unit of units) {
      for (let leveli = 0; leveli < unit.levels.length; leveli++) {
        const level = unit.levels[leveli];
        if (level.type !== 'skill') continue;
        const skillId =
          level.pathLevelMetadata.skillId ??
          level.pathLevelMetadata.anchorSkillId;
        if (!skillId) {
          for (const skillId of level.pathLevelClientData.skillIds) {
            if (!result.skills.byId[skillId])
              throw new Error(`Skill not defined ${skillId}`);
          }
        } else if (result.skills.byId[skillId].levelNumber < 0) {
          result.skills.byId[skillId].levelNumber = leveli + 1;
          result.skills.byId[skillId].unitNumber = unit.unitIndex + 1;
        }
      }
    }

    return result;
  }
}

export default CourseDataParser;
