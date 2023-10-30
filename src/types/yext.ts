export interface YextResponse<T> {
  meta: {
    uuid: string;
    errors?: any[];
  };
  response: T;
}

export type DayIntervalType =
  | { openIntervals: TimeInterval[]; isClosed?: never }
  | { openIntervals?: never; isClosed: boolean };

export interface TimeInterval {
  start: string;
  end: string;
}

export interface HolidayHourType {
  date: string;
  isClosed?: boolean;
  openIntervals?: TimeInterval[];
}

export interface ComplexImageType {
  url: string;
  width: number;
  height: number;
  sourceUrl?: string;
  thumbnails?: Thumbnail[];
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface ImageType {
  url: string;
  width: number;
  height: number;
}

export interface GalleryImage {
  image: ComplexImageType;
}

export interface Address {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}

export interface Location {
  id: string;
  address: Address;
  description: string;
  hours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours?: HolidayHourType[];
  };
  pickupHours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours?: HolidayHourType[];
  };
  driveThroughHours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours?: HolidayHourType[];
  };
  logo: {
    image: ComplexImageType;
  };
  name: string;
  cityCoordinate: Coordinate;
  facebookCoverPhoto: ImageType;
  facebookPageUrl: string;
  facebookProfilePhoto: ImageType;
  photoGallery: GalleryImage[];
  geocodedCoordinate: Coordinate;
  isoRegionCode: string;
  mainPhone: string;
  timezone: string;
  yextDisplayCoordinate: Coordinate;
  yextRoutableCoordinate: Coordinate;
  meta: {
    accountId: string;
    uid: string;
    id: string;
    timestamp: string;
    folderId: string;
    language: string;
    countryCode: string;
    entityType: {
      id: string;
    };
  };
  categoryIds: string[];
  reviewGenerationUrl: string;
  firstPartyReviewPage: string;
  timeZoneUtcOffset: string;
}

export interface YextContent<T> {
  docs: T[];
  count: number;
  nextPageToken?: string;
}

export interface ReviewResponse {
  averageRating: number;
  count: number;
  nextPageToken?: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  authorName: string;
  authorEmail: string;
  url: string;
  publisherDate: number;
  locationId: string;
  accountId: string;
  publisherId: string;
  title: string;
  lastYextUpdateTime: number;
  comments: ReviewComment[];
  status: string;
  flagStatus: string;
  reviewLanguage: string;
  apiIdentifier: string;
}

export interface ReviewComment {
  id: number;
  parentId: number;
  publisherDate: number;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  content: string;
  visibility: string;
}
