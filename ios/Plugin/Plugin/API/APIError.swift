//
// Created by Vitalii Kyrychenko on 16.09.2020.
// Copyright (c) 2020 Max Lynch. All rights reserved.
//

import Foundation

enum APIError: LocalizedError {
    case ErrorResponse(message: String)
    case WrongMimeType(message: String)

    var errorDescription: String? {
        switch self {
        case let .ErrorResponse(message),
             let .WrongMimeType(message):
            return message
        }
    }
}
