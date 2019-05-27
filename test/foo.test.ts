import {testProjectRds} from "./helpers/foo";

// test('basic', () => {
//    expect(sum()).toBe(0);
// });
//
// test('basic again', () => {
//    expect(sum(1, 2)).toBe(3);
// });

test('count', done => {
   testProjectRds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   })
});
