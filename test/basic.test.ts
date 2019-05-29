import {testProjectRds} from "./helpers/helper";

// counting the amount of objects.
test('count', done => {
   let subscription = testProjectRds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   });
   subscription.unsubscribe();
});

// counting the amount of projects when fetched statically.
test('static-count', () => {
   expect(testProjectRds.getStatic().length).toBe(3);
});

// adding an object before initiating.
test('single-add', done => {
   testProjectRds.add({id: 4, name: 'project-4'});
   let subscription = testProjectRds.get().subscribe((projects) => {
      expect(projects.length).toBe(4);
      done();
   });
   subscription.unsubscribe();
});

// removing an object before initiating.
test('single-remove', done => {
   testProjectRds.remove(4);
   let subscription = testProjectRds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   });
   subscription.unsubscribe();
});

// updating an object before initiating.
test('single-update', done => {
   testProjectRds.where('id', '=', 1).update({name: 'update-test'});
   let subscription = testProjectRds.get().subscribe((projects) => {
      expect(projects[0].name).toBe('update-test');
      done();
   });
   subscription.unsubscribe();
});

