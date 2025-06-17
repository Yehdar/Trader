package com.example

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.application.*

fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}
