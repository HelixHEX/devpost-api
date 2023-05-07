interface User {
  id: number
  email: string;
  username: string;
  profile: Profile | null;
  profileId: number;
}

interface Profile {
  id: number;
  name: string;
  bio: string;
  pronouns: string;
}

interface JwtPayload {
  user: User;
}

declare namespace Express {
  export interface Request {
    user: User;
  }

  export interface Response {
    user: User;
  }
}
