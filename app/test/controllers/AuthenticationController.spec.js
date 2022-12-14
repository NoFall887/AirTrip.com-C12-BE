const { User } = require("../../models");
const bcryptjs = require("bcryptjs");

function encryptPass(password) {
  return bcryptjs.hashSync(password);
}

const userData = {
  email: "email@email",
  password: encryptPass("userpass"),
};

const user = new User({ ...userData, role_id: 2 });

describe("AuthenticationController", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const mockRequest = {
    body: {
      email: "email@email",
      password: "userpass",
    },
  };
  const mockNext = jest.fn();
  describe("register", () => {
    const mockRequestRegister = {
      body: {
        ...mockRequest.body,
        phone: "08123456789",
        name: "user name",
        address: "Probolinggo, Jawa Timur",
      },
    };
    it("should call res.status(201) and res.json with user data", async () => {
      const mockAuthService = {
        register: jest.fn().mockReturnValue(Promise.resolve(user.email)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.register(
        mockRequestRegister,
        mockResponse
      );

      expect(mockAuthService.register).toHaveBeenCalledWith(
        mockRequestRegister.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ email: user.email });
    });

    it("should call res.status(422) and res.json with email already registered error", async () => {
      const EmailAlreadyRegisteredError = require("../../errors/EmailAlreadyRegisteredError");
      const err = new EmailAlreadyRegisteredError(
        mockRequestRegister.body.email
      );

      const mockAuthService = {
        register: jest.fn().mockReturnValue(Promise.resolve(err)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);

      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");
      await controllers.api.v1.authenticationController.register(
        mockRequestRegister,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.register).toHaveBeenCalledWith(
        mockRequestRegister.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: err.message });
    });

    it("should call next, req.err should contain error", async () => {
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      jest.mock("../../services/AuthenticationService", () => {
        return {
          register: () => {
            throw Error("error");
          },
        };
      });

      await controllers.api.v1.authenticationController.register(
        mockRequestRegister,
        mockResponse,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("login", () => {
    it("should call res.status(200) and res.json with jwt access token", async () => {
      const dummyToken = "somedummyjwttoken";
      const mockAuthService = {
        login: jest.fn().mockReturnValue(Promise.resolve(dummyToken)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.login(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        accessToken: dummyToken,
      });
    });

    it("should call res.status(404) and res.json with EmailNotRegisteredError", async () => {
      const EmailNotRegisteredError = require("../../errors/EmailNotRegistered");
      const err = new EmailNotRegisteredError(mockRequest.body.email);
      const mockAuthService = {
        login: jest.fn().mockReturnValue(Promise.resolve(err)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.login(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: err.message });
    });

    it("should call res.status(401) and res.json with WrongPasswordError", async () => {
      const { WrongPasswordError } = require("../../errors");
      const err = new WrongPasswordError(mockRequest.body.email);
      const mockAuthService = {
        login: jest.fn().mockReturnValue(Promise.resolve(err)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.login(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: err.message });
    });
  });

  describe("authorize", () => {
    const expectedRole = "BUYER";

    it("should set request.user with decoded and verified token", async () => {
      const token = "Bearer deifncewofinierbgi";
      const noBearerToken = token.split(" ")[1];
      const mockRequestAuthorize = {
        ...mockRequest,
        headers: { authorization: token },
      };
      const mockAuthService = {
        authorize: jest.fn().mockReturnValue(Promise.resolve(userData)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.authorize(expectedRole)(
        mockRequestAuthorize,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.authorize).toHaveBeenCalledWith(
        noBearerToken,
        expectedRole
      );

      expect(mockRequestAuthorize.user).toEqual(userData);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should call res.status(401) with UnauthorizedError", async () => {
      const token = "Bearer deifncewofinierbgi";
      const noBearerToken = token.split(" ")[1];
      const mockRequestAuthorize = {
        ...mockRequest,
        headers: { authorization: token },
      };
      const { WrongPasswordError, UnauthorizedError } = require("../../errors");
      const err = new UnauthorizedError("User not found");
      const mockAuthService = {
        authorize: jest.fn().mockReturnValue(Promise.resolve(err)),
      };
      // mock auth service
      jest.mock("../../services/AuthenticationService", () => mockAuthService);
      const routes = require("../../../config/routes");
      const controllers = require("../../controllers");

      await controllers.api.v1.authenticationController.authorize(expectedRole)(
        mockRequestAuthorize,
        mockResponse,
        mockNext
      );

      expect(mockAuthService.authorize).toHaveBeenCalledWith(
        noBearerToken,
        expectedRole
      );
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: err.message,
        cause: err.cause,
      });
    });
  });
});
