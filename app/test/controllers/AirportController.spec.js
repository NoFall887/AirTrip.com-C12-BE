const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const mockNext = jest.fn().mockReturnThis();

describe("airportController", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("handleGetAirports", () => {
    it("should call res.status(200) and res.json with airports data", async () => {
      const airports = require("../helper/airportsDataExample");
      const mockAirportService = {
        getAirports: jest.fn().mockReturnValue(Promise.resolve(airports)),
      };
      jest.mock("../../services/airportService", () => mockAirportService);
      const controllers = require("../../controllers");

      await controllers.api.v1.airportController.handleGetAirports(
        {},
        mockResponse,
        mockNext
      );

      expect(mockAirportService.getAirports).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: airports });
    });
  });

  describe("handleGetAirportById", () => {
    it("should should call res.status(200) and res.json with airport data", async () => {
      const mockRequest = { params: { id: 1 } };
      const airports = require("../helper/airportsDataExample");
      const mockAirportService = {
        getAirportById: jest.fn().mockReturnValue(Promise.resolve(airports)),
      };
      jest.mock("../../services/airportService", () => mockAirportService);
      const controllers = require("../../controllers");

      await controllers.api.v1.airportController.handleGetAirportById(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockAirportService.getAirportById).toHaveBeenCalledWith(
        mockRequest.params.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: airports });
    });
  });
});
