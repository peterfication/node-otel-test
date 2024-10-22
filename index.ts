import { trace } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";

console.log("Configuring SDK");

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  spanProcessors: [new SimpleSpanProcessor(new ConsoleSpanExporter())],
});

console.log("Starting SDK");
sdk.start();
console.log("Starting trace");

const tracer = trace.getTracer("example-tracer");
tracer.startActiveSpan("expensive-query", (span) => {
  console.log("Doing cool stuff ...");
  span.end();

  console.log("Trace ended");
  console.log("");
});
