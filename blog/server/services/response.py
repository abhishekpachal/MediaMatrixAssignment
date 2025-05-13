import datetime
import os
from flask import jsonify, make_response


class ResponseService:

    # Generic response method
    # status_code: HTTP status code
    # status: 1 for success, 0 for failure
    # msg: message to be returned
    # response: data to be returned
    @staticmethod
    def create_response(status_code=200, status=1, msg="OK", response={}):
        return make_response(jsonify(status=status, msg=msg, response=response), status_code)
