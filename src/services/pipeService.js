define(['./mock/mockPipe'], function (mockPipe) {
    return {
        getPipeList: function (code, cb, errorCb) {
            return mockPipe[code];
        }
    }
});