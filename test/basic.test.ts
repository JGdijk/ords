import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";

const ords = new Ords([
   {name: 'project', model: ProjectTest}
]);

const projectOrds = ords.use('project');

projectOrds.add([
   {id: 1, name: 'project-1'},
   {id: 2, name: 'project-2'},
   {id: 3, name: 'project-3'}
]);

// counting the amount of objects.
test('count', done => {
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   });
   subscription.unsubscribe();
});

// counting the amount of projects when fetched statically.
test('static-count', () => {
   expect(projectOrds.getStatic().length).toBe(3);
});

// adding an object before initiating.
test('single-add', done => {
   projectOrds.add({id: 4, name: 'project-4'});
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects.length).toBe(4);
      done();
   });
   subscription.unsubscribe();
});

// removing an object before initiating.
test('single-remove', done => {
   projectOrds.remove(4);
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   });
   subscription.unsubscribe();
});

// updating an object before initiating.
test('single-update', done => {
   projectOrds.where('id', '=', 1).update({name: 'update-test'});
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects[0].name).toBe('update-test');
      done();
   });
   subscription.unsubscribe();
});

