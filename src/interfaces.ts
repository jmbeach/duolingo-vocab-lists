export interface CoursePathLevel {
  pathLevelMetadata: {
    anchorSkillId: string;
    skillId?: string;
  };
  pathLevelClientData: {
    skillIds: string[];
  };
  debugName: string;
  type: 'story' | 'skill';
}
export interface CoursePath {
  levels: CoursePathLevel[];
  unitIndex: number;
  teachingObjective: string;
}
export interface CourseSection {
  name: string;
  numRows: number;
}
export interface CourseSkill {
  id: string;
  name: string;
  shortName: string;
  urlName: string;
}
export interface CourseData {
  currentCourse: {
    path: CoursePath[];
    sections: CourseSection[];
    skills: CourseSkill[][];
  };
}
export interface ParsedSkill {
  id: string;
  name: string;
  shortName: string;
  sectionNumber: number;
  urlName: string;
  unitNumber: number;
  levelNumber: number;
}
export interface ParsedCourse {
  skills: {
    list: ParsedSkill[];
    byId: Record<string, ParsedSkill>;
    byUrl: Record<string, ParsedSkill>;
  };
}

export interface DownloadedSkillTranslations {
  skillName: string;
  words: Record<string, { translations: string[] }>;
}

export interface DownloadResult {
  // Links sections to ids
  sections: Record<string, string[]>;
  skills: Record<string, DownloadedSkillTranslations>;
  // units -> levels -> ids
  units: Record<string, Record<string, string>>;
}
