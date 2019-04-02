package umm3601;

import com.google.gson.*;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.utils.IOUtils;
import umm3601.user.UserController;
import umm3601.user.UserRequestHandler;
import umm3601.ride.RideController;
import umm3601.ride.RideRequestHandler;


import com.google.gson.GsonBuilder;

import com.google.api.client.googleapis.auth.oauth2.*;
import com.google.api.services.oauth2.*;
import com.google.api.client.json.jackson2.*;
import java.io.FileReader;
import java.io.File;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.googleapis.services.AbstractGoogleClient.Builder;
import com.google.api.client.googleapis.services.json.AbstractGoogleJsonClientRequest;
import com.google.api.services.oauth2.Oauth2Request;
import com.google.api.services.drive.Drive;


//import com.google.*;

import static com.sun.org.apache.xalan.internal.xsltc.compiler.Constants.REDIRECT_URI;
import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

import java.io.IOException;
import java.io.InputStream;

public class Server {
  private static final String databaseName = "dev";
  private static final int serverPort = 4567;

  public static void main(String[] args ) throws IOException {


    // DATABASE
    MongoClient mongoClient = new MongoClient();
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    UserController userController = new UserController(database);
    UserRequestHandler userRequestHandler = new UserRequestHandler(userController);
    RideController rideController = new RideController(database);
    RideRequestHandler rideRequestHandler = new RideRequestHandler(rideController);

    //Configure Spark
    port(serverPort);
    enableDebugScreen();

    // Specify where assets like images will be "stored"
    staticFiles.location("/public");

    options("/*", (request, response) -> {

      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    // Redirects for the "home" page
    redirect.get("", "/");

    Route clientRoute = (req, res) -> {
      InputStream stream = Server.class.getResourceAsStream("/public/index.html");
      return IOUtils.toString(stream);
    };

    get("/", clientRoute);

    /// User Endpoints ///////////////////////////
    /////////////////////////////////////////////

    //List users, filtered using query parameters

    get("api/users", userRequestHandler::getUsers);
    get("api/users/:id", userRequestHandler::getUserJSON);
    post("api/users/new", userRequestHandler::addNewUser);

    // RIDE ENDPOINTS
    get("api/rides", rideRequestHandler::getRides);
    get("api/rides/:id", rideRequestHandler::getRideJSON);
    post("api/rides/new", rideRequestHandler::addNewRide);

    // An example of throwing an unhandled exception so you can see how the
    // Java Spark debugger displays errors like this.
    get("api/error", (req, res) -> {
      throw new RuntimeException("A demonstration error");
    });

    // Called after each request to insert the GZIP header into the response.
    // This causes the response to be compressed _if_ the client specified
    // in their request that they can accept compressed responses.
    // There's a similar "before" method that can be used to modify requests
    // before they they're processed by things like `get`.
    after("*", Server::addGzipHeader);

    get("/*", clientRoute);

    // Handle "404" file not found requests:
    notFound((req, res) -> {
      res.type("text");
      res.status(404);
      return "Sorry, we couldn't find that!";
    });

    // (Receive authCode via HTTPS POST)
    post("login", (req, res) -> {

      Gson gson = new Gson();
      JsonElement element = gson.fromJson(req.body(), JsonElement.class);
      JsonObject jsonObj = element.getAsJsonObject();

      String authCode = jsonObj.get("code").toString(); // assuming the .get("code") returns the value

        try {
          // We can create this later to keep our secret safe

          String CLIENT_SECRET_FILE = "./credentials.json";

          GoogleClientSecrets clientSecrets =
            GoogleClientSecrets.load(
              JacksonFactory.getDefaultInstance(), new FileReader(CLIENT_SECRET_FILE));


          GoogleTokenResponse tokenResponse =
            new GoogleAuthorizationCodeTokenRequest(
              new NetHttpTransport(),
              JacksonFactory.getDefaultInstance(),
              "https://www.googleapis.com/oauth2/v4/token",
              clientSecrets.getDetails().getClientId(),

              // Replace clientSecret with the localhost one if testing
              clientSecrets.getDetails().getClientSecret(),
              authCode,
              "http://localhost:9000")
              //Not sure if we have a redirectUri

              // Specify the same redirect URI that you use with your web
              // app. If you don't have a web version of your app, you can
              // specify an empty string.
              .execute();


          GoogleIdToken idToken = tokenResponse.parseIdToken();
          GoogleIdToken.Payload payload = idToken.getPayload();
          String subjectId = payload.getSubject();  // Use this value as a key to identify a user.
          String email = payload.getEmail();
          boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
          String name = (String) payload.get("name");
          String pictureUrl = (String) payload.get("picture");
          String locale = (String) payload.get("locale");
          String familyName = (String) payload.get("family_name");
          String givenName = (String) payload.get("given_name");

          //Debugging code
          //System.out.println(subjectId);
          //System.out.println(email);
          //System.out.println(name);
          //System.out.println(locale);

      //  return userController.addNewUser(subjectId, givenName, familyName);

        } catch (Exception e) {
          System.out.println(e);
        }

        return "";

    }
    );

  };


  // Enable GZIP for all responses
  private static void addGzipHeader(Request request, Response response) {
    response.header("Content-Encoding", "gzip");
  }
}
