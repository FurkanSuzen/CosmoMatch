export type JobLocation = {
  city: string;
  state: string;
  country: string;
  facility: string;
};

export type JobRequirements = {
  education: string[];
  languages: string[];
  technicalSkills: string[];
  competencies: string[];
};

export type JobSalary = {
  startingAmount: number | null;
  currency: string;
  period: string;
  grade: string;
  displayText: string;
};

export type JobOffer = {
  id: string;
  title: string;
  organization: string;
  category: string;
  tags: string[];
  location: JobLocation;
  employmentType: string;
  contractType: string;
  publishDate: string;
  applicationDeadline: string;
  requirements: JobRequirements;
  benefits: string[];
  salary: JobSalary;
  status: string;
  sourceType: string;
};

export type OrganizationCarrier = {
  organization: string;
  country: string;
  jobs: JobOffer[];
};

export type CarrierCategory = {
  key: string;
  label: string;
};

export type CarriersPayload = {
  categories: CarrierCategory[];
  organizations: OrganizationCarrier[];
  filters: {
    organizations: string[];
    countries: string[];
    employmentTypes: string[];
    contractTypes: string[];
    categories: string[];
    statusOptions: string[];
  };
};

/** Liste kartında kullanılacak genişletilmiş kayıt */
export type FlatJobOffer = JobOffer & {
  /** Üst kurum bloğundaki ülke (filtre için) */
  orgBlockCountry: string;
};
