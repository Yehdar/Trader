package com.example

import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.Serializable
import java.util.concurrent.atomic.AtomicInteger

@Serializable
data class Option(
    val id: Int,
    val ticker: String,
    val type: String, // "call" or "put"
    val strike: Int,
    val price: Double
)

@Serializable
data class TradeRequest(
    val optionId: Int,
    val action: String // "buy" or "sell"
)

@Serializable
data class TradeResponse(
    val message: String,
    val timestamp: String
)

val optionsList = mutableListOf(
    Option(1, "AAPL", "call", 180, 3.5),
    Option(2, "TSLA", "put", 250, 5.0),
    Option(3, "GOOGL", "call", 130, 2.1)
)

val tradeLog = mutableListOf<String>()
val tradeIdCounter = AtomicInteger(1)

fun Application.module() {
    install(CORS) {
        anyHost()
        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowHeader(HttpHeaders.ContentType)
    }

    install(ContentNegotiation) {
        json()
    }

    routing {
        get("/") {
            call.respondText("Options Trading API is live!")
        }

        get("/api/options") {
            call.respond(optionsList)
        }

        post("/api/trade") {
            val trade = call.receive<TradeRequest>()
            val option = optionsList.find { it.id == trade.optionId }

            if (option == null) {
                call.respond(HttpStatusCode.NotFound, TradeResponse("Option not found", getTime()))
                return@post
            }

            val action = trade.action.lowercase()
            if (action !in listOf("buy", "sell")) {
                call.respond(HttpStatusCode.BadRequest, TradeResponse("Invalid action", getTime()))
                return@post
            }

            val message = "Trade #${tradeIdCounter.getAndIncrement()}: ${action.uppercase()} ${option.ticker} ${option.type.uppercase()} @ ${option.strike} for \$${option.price}"
            tradeLog.add(message)

            call.respond(TradeResponse(message, getTime()))
        }

        get("/api/trades") {
            call.respond(tradeLog)
        }

        get("/api/price/{ticker}") {
            val ticker = call.parameters["ticker"]?.uppercase()
            if (ticker.isNullOrBlank()) {
                call.respond(HttpStatusCode.BadRequest, "Ticker symbol is missing.")
                return@get
            }

            // Simulate a price based on the ticker's hashCode
            val simulatedPrice = "%.2f".format((ticker.hashCode() % 1000) / 10.0 + 100)
            call.respondText("Price of $ticker is \$$simulatedPrice")
        }

        get("/api/server-time") {
            call.respondText("Server time is ${getTime()}")
        }
    }
}

fun getTime(): String = java.time.LocalDateTime.now().toString()
