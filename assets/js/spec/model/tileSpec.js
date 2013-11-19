/**
 * Created by rkh on 2013-11-19.
 */
define(['tile', 'jasmine'], function(Tile, jasmine) {
    return describe("Test for  Model::Tile", function() {

        var tile = new Tile();

        afterEach(function() {
           tile.defaults;
        });

        it("Should get instantiated with default values", function() {
            expect(tile.get('position')).toEqual([0, 0]);
            expect(tile.get('typeId')).toBe(-1);
        });

        it("Should get instantiated with values [100,100, id: 2", function() {
            var tile = new Tile({position:[100,100], typeId:2});
            expect(tile.get('position')).toEqual([100, 100]);
            expect(tile.get('typeId')).toBe(2);
        });

        it("Should change position to 300, 300", function() {
            expect(tile.get('position')).toEqual([0, 0]);
            tile.setPosition([300,300]);
            expect(tile.get('position')).toEqual([300,300]);
        });

        it("Should change id to 5", function() {
            expect(tile.get('typeId')).toBe(-1);
            tile.setTypeId(5);
            expect(tile.get('typeId')).toBe(5);
        });

    });
});