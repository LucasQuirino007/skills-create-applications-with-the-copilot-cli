#!/usr/bin/env node
"use strict";

/**
 * Calculadora CLI com suporte às operações básicas:
 * - addition (adição)
 * - subtraction (subtração)
 * - multiplication (multiplicação)
 * - division (divisão)
 */

// Operações suportadas pela calculadora.
const SUPPORTED_OPERATIONS = {
  addition: (a, b) => a + b,
  subtraction: (a, b) => a - b,
  multiplication: (a, b) => a * b,
  division: (a, b) => a / b,
};

function printUsage() {
  console.log("Usage: node src\\calculator.js <operation> <firstNumber> <secondNumber>");
  console.log("Supported operations: addition, subtraction, multiplication, division");
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

  if (operation === "division" && second === 0) {
    throw new Error("Division by zero is not allowed.");
  }

  return executor(first, second);
}

function main() {
  const [, , operation, firstRaw, secondRaw, ...extraArgs] = process.argv;
  if (!operation || !firstRaw || !secondRaw || extraArgs.length > 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  try {
    const first = parseNumber(firstRaw, "first number");
    const second = parseNumber(secondRaw, "second number");
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
  SUPPORTED_OPERATIONS,
  printUsage,
  parseNumber,
  calculate,
  main,
};
