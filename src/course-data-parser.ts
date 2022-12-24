import { CourseData, ParsedCourse, ParsedSkill } from './interfaces';

class CourseDataParser {
  courseData: CourseData;
  constructor(courseData: CourseData) {
    this.courseData = courseData;
  }

  parse(): ParsedCourse {
    const sections = this.courseData.currentCourse.sections;
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
          };
          result.skills.byId[id] = parsedSkill;
          result.skills.byUrl[urlName] = parsedSkill;
          result.skills.list.push(parsedSkill);
        }
      }
      rowCount += section.numRows;
    }

    return result;
  }
}

export default CourseDataParser;
