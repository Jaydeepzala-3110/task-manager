import User from '../models/user.model';

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  accessToken: string;
  user: typeof User;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

export { UserRegistrationData, RegisterRequestBody, RegisterResponse, LoginRequestBody };
