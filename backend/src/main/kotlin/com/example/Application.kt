package com.example

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.http.*


fun main() {
    embeddedServer(Netty, port = 8080) {
        install(CORS) {
            anyHost()
            allowMethod(HttpMethod.Get)
        }
        routing {
            get("/") {
                call.respondText("Ktor backend is running!")
            }
            get("/api/options") {
                call.respond(
                    listOf(
                        mapOf("ticker" to "AAPL", "type" to "call", "strike" to 180, "price" to 3.5)
                    )
                )
            }
        }
    }.start(wait = true)
}
