import Foundation

class FrontendAPI {
    var session: URLSession = URLSession.shared
    var baseUrl: String
    var idToken: String
    var decoder: JSONDecoder = JSONDecoder()

    init(baseUrl: String, idToken: String) {
        self.baseUrl = baseUrl
        self.idToken = idToken
    }

    public func getCustomToken(completion: @escaping (String?, Error?) -> Void){
        let url = URL(string: "\(baseUrl)/api/api/profile/auth/gentoken")!
        var request = URLRequest(url: url)

        request.httpMethod = "GET"
        request.setValue("Bearer \(self.idToken)", forHTTPHeaderField: "Authorization")

        let task = session.dataTask(with: request) { (data, response, error) in

            if error != nil {
                return completion(nil, error)
            }

            if data == nil {
                return completion(nil, nil)
            }

            guard let response = response as? HTTPURLResponse, (200...299).contains(response.statusCode) else {
                return completion(nil, APIError.ErrorResponse(message: "Server respond with error"))
            }

            guard let mime = response.mimeType, mime == "application/json" else {
                completion(nil, APIError.WrongMimeType(message: "Wrong mime type"))
                return
            }

            do {
                let customToken = try self.decoder.decode(CustomTokenRO.self, from: data!)
                completion(customToken.data, nil)
            } catch {
                completion(nil, error)
            }
        }

        task.resume()
    }
}
