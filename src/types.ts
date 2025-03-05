export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  mobileNumber: string;
}

export interface Person {
  id: string;
  name: string;
  sex: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  profession: string;
  city: string;
  lastVisitDate: string;
  familyMembers: FamilyMember[];
}