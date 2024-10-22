import { trace } from "@opentelemetry/api";
import { ExportResult } from "@opentelemetry/core";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ConsoleSpanExporter,
  ReadableSpan,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-node";

class CustomConsoleSpanExporter extends ConsoleSpanExporter {
  override export(
    spans: ReadableSpan[],
    _resultCallback: (result: ExportResult) => void,
  ): void {
    spans.forEach((span) => {
      console.log(
        "OTEL",
        span.instrumentationLibrary.name,
        JSON.stringify(span.attributes),
      );
    });
  }
}

console.log("Configuring SDK");

const exporter = new CustomConsoleSpanExporter();

const sdk = new NodeSDK({
  traceExporter: exporter,
  spanProcessors: [new SimpleSpanProcessor(exporter)],
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
