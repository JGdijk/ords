import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";
import {TaskTest} from "./helpers/models/task-test";

const ords = new Ords([
    {name: 'project', model: ProjectTest},
    {name: 'task', model: TaskTest}
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
    let subscription = projectOrds.with('tasks').get().subscribe((projects) => {
        switch(step) {
            case 0:
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
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(3);
                expect(projects[0].tasks).toMatchObject([
                    {task_id: 1, name: 'task-1'},
                    {task_id: 3, name: 'task-3'},
                    {task_id: 4, name: 'task-4'}
                ]);
                break;
            case 2:
                console.log('oi');
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(4);
                expect(projects[0].tasks[3]).toMatchObject({task_id: 5, name: 'task-7'});
                break;
        }
    });

    step = 1;
    taskOrds.remove(2);

    step = 2;
    projectOrds.attach(1,'tasks', 5);

    // step = 3;
    // taskOrds.remove(2);

    done();
    subscription.unsubscribe();

});