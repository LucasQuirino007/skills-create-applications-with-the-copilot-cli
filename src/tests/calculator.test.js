"use strict";

const {
  SUPPORTED_OPERATIONS,
  printUsage,
  parseNumber,
  calculate,
  main,
} = require("../calculator");

describe("SUPPORTED_OPERATIONS", () => {
  test("contains only the four basic operations", () => {
    expect(Object.keys(SUPPORTED_OPERATIONS).sort()).toEqual([
      "addition",
      "division",
      "multiplication",
      "subtraction",
    ]);
  });
});

describe("parseNumber", () => {
  test("parses integer strings", () => {
    expect(parseNumber("10", "value")).toBe(10);
  });

  test("parses decimal strings", () => {
    expect(parseNumber("3.14", "value")).toBe(3.14);
  });

  test("throws for invalid values", () => {
    expect(() => parseNumber("abc", "value")).toThrow('Invalid value: "abc".');
  });
});

describe("calculate", () => {
  test("runs example addition from image (2 + 3)", () => {
    expect(calculate("addition", 2, 3)).toBe(5);
  });

  test("runs example subtraction from image (10 - 4)", () => {
    expect(calculate("subtraction", 10, 4)).toBe(6);
  });

  test("runs example multiplication from image (45 * 2)", () => {
    expect(calculate("multiplication", 45, 2)).toBe(90);
  });

  test("runs example division from image (20 / 5)", () => {
    expect(calculate("division", 20, 5)).toBe(4);
  });

  test("supports negative numbers", () => {
    expect(calculate("addition", -5, -7)).toBe(-12);
  });

  test("supports decimal numbers", () => {
    expect(calculate("multiplication", 2.5, 4)).toBe(10);
  });

  test("throws for division by zero", () => {
    expect(() => calculate("division", 10, 0)).toThrow("Division by zero is not allowed.");
  });

  test("throws for unsupported operation", () => {
    expect(() => calculate("modulo", 10, 2)).toThrow('Unsupported operation: "modulo".');
  });
});

describe("CLI helpers", () => {
  let logSpy;
  let errorSpy;
  let argvBackup;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    argvBackup = [...process.argv];
    delete process.exitCode;
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    process.argv = argvBackup;
    delete process.exitCode;
  });

  test("printUsage prints usage and supported operations", () => {
    printUsage();
    expect(logSpy).toHaveBeenCalledWith("Usage: node src\\calculator.js <operation> <firstNumber> <secondNumber>");
    expect(logSpy).toHaveBeenCalledWith(
      "Supported operations: addition, subtraction, multiplication, division",
    );
  });

  test("main prints result for a valid operation", () => {
    process.argv = ["node", "src\\calculator.js", "addition", "7", "8"];
    main();

    expect(logSpy).toHaveBeenCalledWith(15);
    expect(errorSpy).not.toHaveBeenCalled();
    expect(process.exitCode).toBeUndefined();
  });

  test("main fails with usage when arguments are missing", () => {
    process.argv = ["node", "src\\calculator.js", "addition", "7"];
    main();

    expect(process.exitCode).toBe(1);
    expect(logSpy).toHaveBeenCalledWith("Usage: node src\\calculator.js <operation> <firstNumber> <secondNumber>");
  });

  test("main fails for invalid numbers", () => {
    process.argv = ["node", "src\\calculator.js", "subtraction", "abc", "2"];
    main();

    expect(errorSpy).toHaveBeenCalledWith('Invalid first number: "abc".');
    expect(process.exitCode).toBe(1);
  });

  test("main fails for division by zero", () => {
    process.argv = ["node", "src\\calculator.js", "division", "10", "0"];
    main();

    expect(errorSpy).toHaveBeenCalledWith("Division by zero is not allowed.");
    expect(process.exitCode).toBe(1);
  });
});
