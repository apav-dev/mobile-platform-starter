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

export interface Location {
  id: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    region: string;
    postalCode: string;
    countryCode: string;
  };
  description: string;
  hours: {
    monday: DayIntervalType;
    tuesday: DayIntervalType;
    wednesday: DayIntervalType;
    thursday: DayIntervalType;
    friday: DayIntervalType;
    saturday: DayIntervalType;
    sunday: DayIntervalType;
    holidayHours: HolidayHourType[];
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
}

export interface Review {
  $key: {
    locale: string;
    primary_key: string;
  };
  authorName: string;
  content: string;
  entity: {
    address: {
      line1: string;
    };
    id: string;
    name: string;
  };
  publisher: string;
  rating: number;
  reviewDate: string;
}
