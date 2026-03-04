export declare const Status: {
    readonly PENDING: "PENDING";
    readonly COMPLETED: "COMPLETED";
};
export type Status = (typeof Status)[keyof typeof Status];
export declare const UserType: {
    readonly STUDENT: "STUDENT";
    readonly EARLY_CAREER: "EARLY_CAREER";
    readonly MID_CAREER: "MID_CAREER";
    readonly EXPERIENCED_PROFESSIONAL: "EXPERIENCED_PROFESSIONAL";
    readonly CAREER_SWITCHER: "CAREER_SWITCHER";
    readonly ADMIN: "ADMIN";
};
export type UserType = (typeof UserType)[keyof typeof UserType];
export declare const Level: {
    readonly ENTRY_LEVEL: "ENTRY_LEVEL";
    readonly MID_LEVEL: "MID_LEVEL";
    readonly SENIOR_LEVEL: "SENIOR_LEVEL";
    readonly LEAD_MANAGER: "LEAD_MANAGER";
};
export type Level = (typeof Level)[keyof typeof Level];
export declare const ApplicationStatus: {
    readonly PENDING: "PENDING";
    readonly REVIEWED: "REVIEWED";
    readonly ACCEPTED: "ACCEPTED";
    readonly REJECTED: "REJECTED";
};
export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
//# sourceMappingURL=enums.d.ts.map