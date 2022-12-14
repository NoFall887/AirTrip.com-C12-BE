const express = require("express");
const controllers = require("../app/controllers");
const apiRouter = express.Router();
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const Roles = {
  ADMIN: "ADMIN",
  BUYER: "BUYER",
};

apiRouter.use(cors());
// API List here
apiRouter.get("/", controllers.main.handleGetRoot);

// USER ENDPOINTS
apiRouter.post(
  "/register",
  controllers.api.v1.authenticationController.register
);

apiRouter.post("/login", controllers.api.v1.authenticationController.login);
apiRouter.put(
  "/users/update/:id",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.userController.handleUpdateUser
);
apiRouter.get(
  "/whoami",
  controllers.api.v1.authenticationController.authorize(true),
  controllers.api.v1.userController.handleWhoami
);

// AIRPORT ENDPOINTS
apiRouter.get(
  "/airports",
  controllers.api.v1.airportController.handleGetAirports
);
apiRouter.get(
  "/airports/:id",
  controllers.api.v1.airportController.handleGetAirportById
);
// FLIGHT ENDPOINTS
// create flight data
apiRouter.post(
  "/flights/create",
  controllers.api.v1.authenticationController.authorize("ADMIN"),
  controllers.api.v1.flightController.handleCreateFlight
);

// get all flight data
apiRouter.get(
  "/flights",
  controllers.api.v1.flightController.handleListFlights
);

// update flight data
apiRouter.put(
  "/flights/update/:id",
  controllers.api.v1.authenticationController.authorize("ADMIN"),
  controllers.api.v1.flightController.handleUpdateFlight
);

// delete flight data
apiRouter.delete(
  "/flights/delete/:id",
  controllers.api.v1.authenticationController.authorize("ADMIN"),
  controllers.api.v1.flightController.handleDeleteFlight
);

apiRouter.get(
  "/flights/search",
  controllers.api.v1.flightController.handleSearchFlights
);

apiRouter.get(
  "/flights/search-return",
  controllers.api.v1.flightController.handleSearchReturnFlights
);

// TICKET ENDPOINTS
apiRouter.post(
  "/tickets/create",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.ticketController.handleCreateTicket
);

apiRouter.get(
  "/tickets/history",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.ticketController.handleTicketHistory
);

apiRouter.get(
  "/tickets",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.ticketController.handleGetTickets
);

// AIRPLANE ENDPOINTS
apiRouter.post(
  "/airplanes/create",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.airplaneController.handleCreateAirplane
);

apiRouter.get(
  "/airplanes",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.airplaneController.handleGetAirplanes
);

apiRouter.get(
  "/airplanes/:id",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.airplaneController.handleGetAirplaneById
);

apiRouter.delete(
  "/airplanes/delete/:id",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.airplaneController.handleDeleteAirplane
);

apiRouter.put(
  "/airplanes/update/:id",
  controllers.api.v1.authenticationController.authorize(Roles.ADMIN),
  controllers.api.v1.airplaneController.handleUpdateAirplane
);

// NOTIFICATION ENDPOINTS
apiRouter.get(
  "/notifications",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.notificationController.handleGetNotifications
);

apiRouter.put(
  "/notifications/read/:id",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.notificationController.handleMarkRead
);

// WISHLIST ENDPOINT
apiRouter.post(
  "/wishlists/create",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.wishlistController.handleCreateWishlist
);

apiRouter.get(
  "/wishlists",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.wishlistController.handleGetWishlist
);

apiRouter.delete(
  "/wishlists/delete/:id",
  controllers.api.v1.authenticationController.authorize(Roles.BUYER),
  controllers.api.v1.wishlistController.handleDeleteWishlist
);

// for authorization testing purpose only
if (process.env.NODE_ENV !== "production") {
  apiRouter.post(
    "/authorize",
    controllers.api.v1.authenticationController.authorize(Roles.BUYER),
    (req, res) => {
      return res.json(req.user);
    }
  );
}
apiRouter.use(controllers.main.handleNotFound);
apiRouter.use(controllers.main.handleError);

console.log(listEndpoints(apiRouter));

module.exports = apiRouter;
