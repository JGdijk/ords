import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";
import {TaskTest} from "./helpers/models/task-test";
import {UserTest} from "./helpers/models/user-test";
import {JoinCallback} from "../src/instance/statements/join/statements/callback/join-callback";
import {WhereHasStatementCallback} from "../src/instance/statements/where/statements/callback/where-has/where-has-statement-callback";

const ords = new Ords([
    {name: 'project', model: ProjectTest},
    {name: 'task', model: TaskTest},
    {name: 'user', model: UserTest}
]);

const projectOrds = ords.use('project');
const taskOrds = ords.use('task');
const userOrds = ords.use('user');

projectOrds.add([
    {id: 1, name: 'project-1', tasks: [
            {task_id: 1, name: 'task-1', random: 300},
            {task_id: 2, name: 'task-2', random: 100, users: [
                    {id: 1, name: 'user-1', random: 20},
                    {id: 2, name: 'user-2', random: 10},
                    {id: 3, name: 'user-3', random: 50}
                ]},
            {task_id: 3, name: 'task-3', random: 500},
            {task_id: 4, name: 'task-4', random: 200, users: [
                    {id: 10, name: 'user-10', random: 2},
                    {id: 11, name: 'user-11', random: 1},
                    {id: 12, name: 'user-12', random: 5}
                ]}
        ]},
    {id: 2, name: 'project-2'},
    {id: 3, name: 'project-3'}
]);

taskOrds.add([
    {task_id: 5, name: 'task-5'}
]);


test('complex-relation', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds
        .with('tasks', (joinTaskCallback: JoinCallback) => {
            joinTaskCallback
                .with('users', (joinUsersCallback: JoinCallback) => {
                    joinUsersCallback.orderBy('random');
                })
                .orderBy('random', 'desc')
                .whereHas('users', (whereHasUsersCallback: WhereHasStatementCallback) => {
                    whereHasUsersCallback.where('random', '>', 5);
                })
        })
        .get()
        .subscribe((projects) => {

        console.log(projects);
        steps_taken ++;

        switch(step) {
            case 0:
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(1);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1', tasks: [
                            {task_id: 2, name: 'task-2', random: 100, users: [
                                    {id: 2, name: 'user-2', random: 10},
                                    {id: 1, name: 'user-1', random: 20},
                                    {id: 3, name: 'user-3', random: 50}
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;
            case 1:
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(2);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1', tasks: [
                            {task_id: 4, name: 'task-4', random: 200, users: [
                                    {id: 11, name: 'user-11', random: 1},
                                    {id: 12, name: 'user-12', random: 5},
                                    {id: 10, name: 'user-10', random: 50},
                                ]},
                            {task_id: 2, name: 'task-2', random: 100, users: [
                                    {id: 2, name: 'user-2', random: 10},
                                    {id: 1, name: 'user-1', random: 20},
                                    {id: 3, name: 'user-3', random: 50}
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;
            case 2:
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(1);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1', tasks: [
                            {task_id: 2, name: 'task-2', random: 100, users: [
                                    {id: 2, name: 'user-2', random: 10},
                                    {id: 1, name: 'user-1', random: 20},
                                    {id: 3, name: 'user-3', random: 50}
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;
            case 3:
                console.log(3);
                console.log(projects[0].tasks);
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(2);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1', tasks: [
                            {task_id: 4, name: 'task-4', random: 200, users: [
                                    {id: 11, name: 'user-11', random: 1},
                                    {id: 12, name: 'user-12', random: 5},
                                    {id: 20, name: 'user-20', random: 500},
                                ]},
                            {task_id: 2, name: 'task-2', random: 100, users: [
                                    {id: 2, name: 'user-2', random: 10},
                                    {id: 1, name: 'user-1', random: 20},
                                    {id: 3, name: 'user-3', random: 50}
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;

        }
    });

    step = 1;
    userOrds.update({random: 50}, 10);

    step = 2;
    taskOrds.detach(4, 'users', 10);

    step = 3;
    userOrds.add({id: 20, name: 'user-20', random: 500});
    taskOrds.attach(4, 'users', 20);


    expect(steps_taken).toBe(4);
    done();
    subscription.unsubscribe();

});

// todo doesn't have test