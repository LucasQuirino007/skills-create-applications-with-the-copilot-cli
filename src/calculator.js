#!/usr/bin/env node
"use strict";

/**
 * Calculadora CLI com suporte às operações básicas:
 * - addition (adição)
 * - subtraction (subtração)
 * - multiplication (multiplicação)
 * - division (divisão)
 * - modulo (módulo)
 * - power (potência)
 * - squareRoot (raiz quadrada)
 */

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Square root of a negative number is not allowed.");
  }

  return Math.sqrt(n);
}

// Operações suportadas pela calculadora.
const SUPPORTED_OPERATIONS = {
  addition: (a, b) => a + b,
  subtraction: (a, b) => a - b,
  multiplication: (a, b) => a * b,
  division: (a, b) => a / b,
  modulo,
  power,
  squareRoot,
};

function printUsage() {
  console.log("Usage: node src\\calculator.js <operation> <firstNumber> [secondNumber]");
  console.log(
    "Supported operations: addition, subtraction, multiplication, division, modulo, power, squareRoot",
  );
}

function parseNumber(rawValue, label) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${label}: "${rawValue}".`);
  }

  return value;
}

function calculate(operation, first, second) {
  const executor = SUPPORTED_OPERATIONS[operation];
  if (!executor) {
    throw new Error(`Unsupported operation: "${operation}".`);
  }

  if (operation === "squareRoot") {
    return executor(first);
  }

  if (second === undefined) {
    throw new Error(`Operation "${operation}" requires a second number.`);
  }

  if (operation === "division" && second === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  if (operation === "modulo" && second === 0) {
    throw new Error("Modulo by zero is not allowed.");
  }

  return executor(first, second);
}

function main() {
  const [, , operation, firstRaw, secondRaw, ...extraArgs] = process.argv;
  const expectsSecondNumber = operation !== "squareRoot";
  if (
    !operation ||
    !firstRaw ||
    extraArgs.length > 0 ||
    (expectsSecondNumber && !secondRaw) ||
    (!expectsSecondNumber && secondRaw)
  ) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const first = parseNumber(firstRaw, "first number");
    const second = secondRaw === undefined ? undefined : parseNumber(secondRaw, "second number");
    const result = calculate(operation, first, second);
    console.log(result);
  } catch (error) {
    console.error(error.message);
    printUsage();
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  modulo,
  power,
  squareRoot,
  SUPPORTED_OPERATIONS,
  printUsage,
  parseNumber,
  calculate,
  main,
};
