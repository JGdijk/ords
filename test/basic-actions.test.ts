import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";
import {TaskTest} from "./helpers/models/task-test";

const ords = new Ords([
   {name: 'project', model: ProjectTest, relations: [
         {name: 'tasks', model_name: 'task', returns_many: true, type: 'hasMany'}
      ]},
   {name: 'task', model: TaskTest, primaryKey: 'task_id'}
]);

const projectOrds = ords.use('project');

projectOrds.add([
   {id: 1, name: 'project-1', tasks: [
         {task_id: 1, name: 'task-1'},
         {task_id: 2, name: 'task-2'},
         {task_id: 3, name: 'task-3'},
         {task_id: 4, name: 'task-4'}
      ]},
   {id: 2, name: 'project-2'},
   {id: 3, name: 'project-3'}
]);

// counting the amount of objects.
test('get', done => {
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects.length).toBe(3);
      done();
   });
   subscription.unsubscribe();
});

// counting the amount of projects when fetched statically.
test('static-get', () => {
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
   projectOrds.where('id', '===', 1).update({name: 'update-test'});
   let subscription = projectOrds.get().subscribe((projects) => {
      expect(projects[0].name).toBe('update-test');
      done();
   });
   subscription.unsubscribe();
});

