const wishlists = require("../helper/wishlistDataExample");

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};
const mockNext = jest.fn().mockReturnThis();

describe("wishlistController", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  describe("handleCreateWishlist", () => {
    const wishlist = wishlists[0];
    it("should call res.status(200) and res.json with wishlist data", async () => {
      const mockRequest = {
        body: {
          flightId: 1,
        },
        user: { id: 1 },
      };
      const mockWishlistService = {
        createWishlist: jest.fn().mockReturnValue(Promise.resolve(wishlist)),
      };
      jest.mock("../../services/wishlistService", () => mockWishlistService);

      const controllers = require("../../controllers");

      await controllers.api.v1.wishlistController.handleCreateWishlist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockWishlistService.createWishlist).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockRequest.body.flightId
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: wishlist });
    });
  });
  describe("handlegetWishlists", () => {
    it("should call res.status(200) and res.json with wishlists of user", async () => {
      const mockRequest = {
        user: { id: 1 },
      };
      const mockWishlistService = {
        getWishlists: jest.fn().mockReturnValue(Promise.resolve(wishlists)),
      };
      jest.mock("../../services/wishlistService", () => mockWishlistService);

      const controllers = require("../../controllers");

      await controllers.api.v1.wishlistController.handleGetWishlist(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockWishlistService.getWishlists).toHaveBeenCalledWith(
        mockRequest.user.id
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: wishlists });
    });
  });

  describe("handleDeleteWishlist", () => {
    test.each([1, 0])(
      "should call res.status(200) and res.json with message",
      async (deleted) => {
        const wishlistId = 1;
        const mockRequest = {
          params: {
            id: 1,
          },
        };
        const mockWishlistService = {
          deleteWishlist: jest.fn().mockReturnValue(Promise.resolve(deleted)),
        };
        jest.mock("../../services/wishlistService", () => mockWishlistService);

        const controllers = require("../../controllers");

        await controllers.api.v1.wishlistController.handleDeleteWishlist(
          mockRequest,
          mockResponse,
          mockNext
        );

        expect(mockWishlistService.deleteWishlist).toHaveBeenCalledWith(
          wishlistId
        );
        if (deleted < 1) {
          expect(mockResponse.status).toHaveBeenCalledWith(404);
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: `Wishlist id ${mockRequest.params.id} not found!`,
          });
          return;
        }
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: `Wishlist id ${mockRequest.params.id} deleted!`,
        });
      }
    );
  });
});
