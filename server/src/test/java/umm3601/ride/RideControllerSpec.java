package umm3601.ride;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.Before;

import java.util.ArrayList;
import java.util.List;

public class RideControllerSpec {
  private RideController rideController;
  private ObjectId ellisRideId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> rideDocuments = db.getCollection("rides");
    rideDocuments.drop();
    List<Document> testRides = new ArrayList<>();
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Colt\",\n" +
      "                    seats_available: 3,\n" +
      "                    start_location: \"Morris Campus, Gay Hall\",\n" +
      "                    end_location: \"Twin Cities\"\n" +
      "                    departure_date: \"Wednesday the 15th of March\",\n" +
      "                    departure_time: \"5:00PM\",\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Avery\",\n" +
      "                    seats_available: 13,\n" +
      "                    start_location: \"534 e 5th St, Morris MN 56261\",\n" +
      "                    end_location: \"Culver's, Alexandria\"\n" +
      "                    departure_date: \"5/15/19\",\n" +
      "                    departure_time: \"3:30pm\",\n" +
      "                }"));
    testRides.add(Document.parse("{\n" +
      "                    driver: \"Michael\",\n" +
      "                    seats_available: 1,\n" +
      "                    start_location: \"On campus\",\n" +
      "                    end_location: \"Willies\"\n" +
      "                    departure_date: \"\",\n" +
      "                    departure_time: \"5pm\",\n" +
      "                }"));

    ellisRideId = new ObjectId();
    BasicDBObject ellisRide = new BasicDBObject("_id", ellisRideId);
    ellisRide = ellisRide.append("driver", "Ellis")
      .append("seats_available", 2)
      .append("start_location", "Casey's General Store")
      .append("end_location", "Perkin's")
      .append("departure_date", "March 17th")
      .append("departure_time", "");

    rideDocuments.insertMany(testRides);
    rideDocuments.insertOne(Document.parse(ellisRide.toJson()));

    rideController = new RideController(db);
  }
}
