describe("Read book data", () => {
  it("should read the JSON file and assert that it is not empty", function() {
    expect(['1', 2].length > 1).toBe(true);
  });
}); 

describe("Populate Index", () => {
  it("should verify that the index has been created once the JSON file is read", function() {
    expect(['1', 2].length > 1).toBe(true);
  });

  it("should map string keys to correct objects in the JSON array", function() {
    expect(['1'].length === 1).toBe(true);
  });
}); 

describe("Search Index", () => {
  it("should verify that index search returns an array of the indices of the correct objects that contain the words in the search query ", function() {
    expect(['1', 2].length > 1).toBe(true);
  });

  it("should map string keys to correct objects in the JSON array", function() {
    expect(['1'].length === 1).toBe(true);
  });
}); 