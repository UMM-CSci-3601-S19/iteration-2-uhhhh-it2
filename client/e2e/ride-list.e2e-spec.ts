import {RidePage} from './ride-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

// This line (combined with the function that follows) is here for us
// to be able to see what happens (part of slowing things down)
// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  // queue 100ms wait between test
  // This delay is only put here so that you can watch the browser do its thing.
  // If you're tired of it taking long you can remove this call or change the delay
  // to something smaller (even 0).
  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(100);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};


describe('Using filters on Ride Page', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
  });

  it('should filter by destination', () => {
    page.navigateTo();
    page.getElementById("rideDestination").sendKeys("IA");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });
  });

  it('should filter by origin', () => {
    page.navigateTo();
    page.getElementById("rideOrigin").sendKeys("IA");
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

  it('should get only rides offered when radio button pressed', () => {
    page.navigateTo();
    page.getElementById("isDrivingButton").click();
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

  it('should get only rides requested when radio button pressed', () => {
    page.navigateTo();
    page.getElementById("isNotDrivingButton").click();
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });
  });

  it('should toggle nonSmoking checkbox to get rides', () => {
    page.navigateTo();
    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking ON... should remove 1 ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(4);
    });
    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking OFF... we have all (5) rides again
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });
  });

  it('should have all the filters work together', () => {
    page.navigateTo();

    page.getRides().then( (rides) => {
      expect(rides.length).toBe(5);
    });

    page.getElementById("rideOrigin").sendKeys("s"); // should remove one ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(4);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking ON... should remove one ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });

    page.getElementById("isDrivingButton").click(); // should remove one ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2);
    });

    page.getElementById("rideDestination").sendKeys("f"); // should remove one ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("rideDestination").sendKeys("8"); // should remove one ride (now 'rides' is empty)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(0);
    });

    page.getElementById("isNotDrivingButton").click(); // no change (still empty)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(0);
    });

    page.getElementById("rideDestination").click();
    page.backspace(2) // erases input in destination field. should now have ONE ride
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(1);
    });

    page.getElementById("checkboxNonSmoking").click(); // toggle non-smoking OFF...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2); // two rides...
    });

    page.getElementById("rideOrigin").click();
    page.backspace(1) // erases input in origin field. no change...
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(2); // two rides (requested)...
    });

    page.getElementById("isDrivingButton").click(); // should give us our remaining three rides (offered)
    page.getRides().then( (rides) => {
      expect(rides.length).toBe(3);
    });
  });

});

describe('Ride list', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    browser.executeScript("window.localStorage.setItem('isSignedIn','true')");
    browser.executeScript("window.localStorage.setItem('userID', 'defaultUserID')");
    browser.executeScript("window.localStorage.setItem('userFirstName', 'Patrick')");
    browser.executeScript("window.localStorage.setItem('userLastName', 'Bateman')");

    // element(by.className("abcRioButtonContentWrapper")).click();
    // browser.driver.sleep(1500);
    // browser.switchTo().window(handles[1])
    // page.field('whsOnd zHQkBf').sendKeys('morideE2Etesting@gmail.com\n');
    // browser.driver.sleep(1500);
    // page.click('rideslistbutton')


   // morideE2Etesting@gmail.com
   // MorideP5ssword

  });

  it('should get and highlight Rides title attribute ', () => {
    page.navigateTo();
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });

  it('should load some rides', () => {
    expect(page.elementExistsWithCss('.rides')).toBeTruthy();
  });

  it('Should have an add ride button', () => {
    page.navigateTo();
    expect(page.elementExistsWithId('add-ride-button')).toBeTruthy();
  });

  it('Should open a page when add ride button is clicked', () => {
    page.navigateTo();
    page.click('add-ride-button');
    expect(page.getAddRideTitle()).toEqual('Add a Ride');
  });

  it('Should revert to the ride-list page after canceling add ride', () => {
    page.navigateTo();
    page.click('add-ride-button');
    expect(page.getAddRideTitle()).toEqual('Add a Ride');
    page.click('exitWithoutAddingButton');
    expect(page.getRideTitle()).toEqual('Upcoming Rides');
  });
});

describe('Add Ride', () => {
  let page: RidePage;

  beforeEach(() => {
    page = new RidePage();
    page.navigateTo();
    page.click('add-ride-button');
  });

  it('Should add the information we put in the fields by keystroke to the database', () => {
    page.navigateTo();
    page.click('add-ride-button');

    page.setIsDriving();
    page.field('driverID').sendKeys('JohnDoe');
    page.field('notesField').sendKeys('Likes to play music. Climate control. Gregarious.');
    page.field('seatsAvailableField').sendKeys('2');
    page.field('originField').sendKeys('Morris, MN');
    page.field('destinationField').sendKeys('Alexandria, MN');
    page.field('departureDateField').sendKeys('3/13/2019');
    page.field('departureTimeField').sendKeys('6:00PM');
    page.setNonSmoking();
    page.click('confirmAddRideButton');

    expect(page.getRideTitle()).toEqual('Upcoming Rides');
    expect(page.getUniqueRide('JohnDoe')).toMatch('JohnDoe');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Likes to play music. Climate control. Gregarious.');
    expect(page.getUniqueRide('JohnDoe')).toMatch('2');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Morris, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Alexandria, MN');
    expect(page.getUniqueRide('JohnDoe')).toMatch('March 13th at 06:00 PM');
    expect(page.getUniqueRide('JohnDoe')).toMatch('Non-smoking');
    expect(page.getUniqueRide('JohnDoe')).toMatch('offering this ride');


  });

  it('Should add the information to the database if non-required data is missing', () => {
    page.navigateTo();
    page.click('add-ride-button');

    page.setIsNotDriving();
    page.field('driverID').sendKeys('Jefferson Macaroni');
    page.field('originField').sendKeys('Washington, D.C.');
    page.field('destinationField').sendKeys('Morris, MN');
    page.click('confirmAddRideButton')

    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Jefferson Macaroni');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Washington, D.C.');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('Morris, MN');
    expect(page.getUniqueRide('Jefferson Macaroni')).toMatch('requesting this ride');
  });

});




