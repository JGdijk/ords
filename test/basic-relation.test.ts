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
const taskOrds = ords.use('task');

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

taskOrds.add([
    {task_id: 5, name: 'task-5'}
]);


test('simple-relation-observable', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds.with('tasks').get().subscribe((projects) => {
        switch(step) {
            case 0:
                projects[0].tasks;
                projects[0].tasks;

                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(4);
                expect(projects[0].tasks).toMatchObject([
                    {task_id: 1, name: 'task-1'},
                    {task_id: 2, name: 'task-2'},
                    {task_id: 3, name: 'task-3'},
                    {task_id: 4, name: 'task-4'}
                ]);
                break;
            case 1:
                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(3);
                expect(projects[0].tasks).toMatchObject([
                    {task_id: 1, name: 'task-1'},
                    {task_id: 3, name: 'task-3'},
                    {task_id: 4, name: 'task-4'}
                ]);
                break;
            case 2:
                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(4);
                expect(projects[0].tasks[3]).toMatchObject({task_id: 5, name: 'task-5'});
                break;
            case 3:
                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(2);
                break;
        }
    });

    step = 1;
    taskOrds.remove(2);

    step = 2;
    projectOrds.attach(1,'tasks', 5);

    step = 3;
    projectOrds.detach(1, 'tasks', [3,4]);

    expect(steps_taken).toBe(4);
    done();
    subscription.unsubscribe();

});
