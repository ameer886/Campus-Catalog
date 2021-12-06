from werkzeug.exceptions import HTTPException, NotFound


class InvalidParamterException(HTTPException):
    code = 400


class HousingNotFound(NotFound):
    pass


class AmenityNotFound(NotFound):
    pass


class UniversityNotFound(NotFound):
    pass
