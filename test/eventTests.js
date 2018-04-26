var expect = require('chai').expect;
var {
    create,
    // delete,
    find,
    findById,
    getAllEvents,
    isValid
} = require('../domain/Event');

// validate
describe('isValid()', function () {
    it('should validate the model to create an event', function () {
        var title = 'test title';
        var description = 'test description';
        var date = "2018-07-19T18:30:00 -0700";

        // 2. ACT
        var valid = isValid({ title, description, date });

        var invalidTE = isValid({ title: '', description, date });
        var invalidTN = isValid({ title: null, description, date });
        var invalidTU = isValid({ title: undefined, description, date });

        var invalidDeE = isValid({ title, description: '', date });
        var invalidDeN = isValid({ title, description: null, date });
        var invalidDeU = isValid({ title, description: undefined, date });

        var invalidDaE = isValid({ title, description, date: '' });
        var invalidDaN = isValid({ title, description, date: null });
        var invalidDaU = isValid({ title, description, date: undefined });
        var invalidDaI = isValid({ title, description, date: 'foobar' });

        // 3. ASSERT
        expect(valid).to.be.equal(true);

        expect(invalidTE).to.be.equal(false);
        expect(invalidTN).to.be.equal(false);
        expect(invalidTU).to.be.equal(false);

        expect(invalidDeE).to.be.equal(false);
        expect(invalidDeN).to.be.equal(false);
        expect(invalidDeU).to.be.equal(false);

        expect(invalidDaN).to.be.equal(false);
        expect(invalidDaE).to.be.equal(false);
        expect(invalidDaU).to.be.equal(false);
        expect(invalidDaI).to.be.equal(false);
    });
});
