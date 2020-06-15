import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";
import {TaskTest} from "./helpers/models/task-test";
import {UserTest} from "./helpers/models/user-test";
import {JoinCallback} from "../src/instance/statements/join/statements/callback/join-callback";
import {WhereHasStatementCallback} from "../src/instance/statements/where/statements/callback/where-has/where-has-statement-callback";
import {WhereDoesntHaveStatementCallback} from "../src/instance/statements/where/statements/callback/where-doesnt-have/where-doesnt-have-statement-callback";
import {AddressTest} from "./helpers/models/address-test";

const ords = new Ords([
    {name: 'project', model: ProjectTest, relations: [
            {name: 'tasks', model_name: 'task', type: 'hasMany'}
        ]},
    {name: 'task', model: TaskTest, primaryKey: 'task_id', relations: [
            {name: 'users', model_name: 'user', type: 'hasMany'}
        ]},
    {name: 'user', model: UserTest, relations: [
            {name: 'address', model_name: 'address', type: 'hasOne'}
        ]},
    {name: 'address', model: AddressTest}
]);

const projectOrds = ords.use('project');
const taskOrds = ords.use('task');
const userOrds = ords.use('user');
const addressOrds = ords.use('address');

projectOrds.add([
    {id: 1, name: 'project-1', tasks: [
            {task_id: 1, name: 'task-1', random: 300},
            {task_id: 2, name: 'task-2', random: 100, users: [
                    {id: 1, name: 'user-1', random: 20, address: {
                            id: 1, name: 'straat1'
                        }
                    },
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


test('complex-relation-where-has', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds
        .with('tasks', (joinTaskCallback: JoinCallback) => {
            joinTaskCallback
                .with('users', (joinUsersCallback: JoinCallback) => {
                    joinUsersCallback.orderBy('random');
                    joinUsersCallback.with('address');
                })
                .orderBy('random', 'desc')
                .whereHas('users', (whereHasUsersCallback: WhereHasStatementCallback) => {
                    whereHasUsersCallback.where('random', '>', 5);
                })
        })
        .get()
        .subscribe((projects) => {

        steps_taken ++;

        switch(step) {
            case 0:
                expect(projects.length).toBe(3);
                expect(projects[0].tasks.length).toBe(1);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1', tasks: [
                            {task_id: 2, name: 'task-2', random: 100, users: [
                                    {id: 2, name: 'user-2', random: 10},
                                    {id: 1, name: 'user-1', random: 20 , address: {
                                            id: 1, name: 'straat1'
                                        }},
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
                                    {id: 1, name: 'user-1', random: 20, address: {
                                            id: 1, name: 'straat1'
                                        } },
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
                                    {id: 1, name: 'user-1', random: 20, address: {
                                            id: 1, name: 'straat1'
                                        }},
                                    {id: 3, name: 'user-3', random: 50}
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;
            case 3:
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
                                    {id: 1, name: 'user-1', random: 20, address: {
                                            id: 1, name: 'straat1'
                                        }},
                                    {id: 3, name: 'user-3', random: 50 }
                                ]},
                        ]},
                    {id: 2, name: 'project-2', tasks: []},
                    {id: 3, name: 'project-3', tasks: []}
                ]);
                break;
            case 4:
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
                                    {id: 1, name: 'user-1', random: 20, address: {
                                            id: 1, name: 'straat2'
                                        }},
                                    {id: 3, name: 'user-3', random: 50 }
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

    step = 4;
    addressOrds.update({name: 'straat2'}, 1);


    expect(steps_taken).toBe(5);
    done();
    subscription.unsubscribe();
});

const ords2 = new Ords([
    {name: 'project', model: ProjectTest, relations: [
            {name: 'tasks', model_name: 'task', type: 'hasMany'}
        ]},
    {name: 'task', model: TaskTest, primaryKey: 'task_id', relations: [
            {name: 'users', model_name: 'user', type: 'hasMany'}
        ]},
    {name: 'user', model: UserTest}
]);

const projectOrds2 = ords2.use('project');
const taskOrds2 = ords2.use('task');
const userOrds2 = ords2.use('user');

projectOrds2.add([
    {id: 1, name: 'project-1', tasks: [
            {task_id: 1, name: 'task-1', random: 300},
            {task_id: 2, name: 'task-2', random: 100, users: [
                    {id: 1, name: 'user-1', random: 20},
                    {id: 2, name: 'user-2', random: 1},
                ]},
            {task_id: 3, name: 'task-3', random: 500},
            {task_id: 4, name: 'task-4', random: 200, users: [
                    {id: 10, name: 'user-10', random: 2},
                ]}
        ]},
    {id: 2, name: 'project-2'},
    {id: 3, name: 'project-3'}
]);

taskOrds2.add([
    {task_id: 5, name: 'task-5'}
]);


test('complex-relation-where-doesnt-have', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds2
        .with('tasks', (joinTaskCallback: JoinCallback) => {
            joinTaskCallback
                .with('users')
                .orderBy('random', 'desc')
                .whereDoesntHave('users', (whereHasUsersCallback: WhereDoesntHaveStatementCallback) => {
                    whereHasUsersCallback.where('random', '>', 5);
                })
        })
        .get()
        .subscribe((projects) => {
            steps_taken ++;
            switch(step) {
                case 0:
                    expect(projects.length).toBe(3);
                    expect(projects[0].tasks.length).toBe(3);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', tasks: [
                            {task_id: 3, name: 'task-3', random: 500, users: []},
                            {task_id: 1, name: 'task-1', random: 300, users: []},
                            {task_id: 4, name: 'task-4', random: 200, users: [
                                    {id: 10, name: 'user-10', random: 2},
                                ]}
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
                                {task_id: 3, name: 'task-3', random: 500, users: []},
                                {task_id: 1, name: 'task-1', random: 300, users: []}
                            ]},
                        {id: 2, name: 'project-2', tasks: []},
                        {id: 3, name: 'project-3', tasks: []}
                    ]);
                    break;
                case 2:
                    expect(projects.length).toBe(3);
                    expect(projects[0].tasks.length).toBe(3);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', tasks: [
                                {task_id: 3, name: 'task-3', random: 500, users: []},
                                {task_id: 1, name: 'task-1', random: 300, users: []},
                                {task_id: 4, name: 'task-4', random: 200, users: []}
                            ]},
                        {id: 2, name: 'project-2', tasks: []},
                        {id: 3, name: 'project-3', tasks: []}
                    ]);
                    break;
                case 3:
                    expect(projects.length).toBe(3);
                    expect(projects[0].tasks.length).toBe(2);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', tasks: [
                                {task_id: 3, name: 'task-3', random: 500, users: []},
                                {task_id: 1, name: 'task-1', random: 300, users: []}
                            ]},
                        {id: 2, name: 'project-2', tasks: []},
                        {id: 3, name: 'project-3', tasks: []}
                    ]);
                    break;
                case 4:
                    expect(projects.length).toBe(3);
                    expect(projects[0].tasks.length).toBe(2);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', tasks: [
                                {task_id: 3, name: 'task-3', random: 500, users: []},
                                {task_id: 1, name: 'task-1', random: 300, users: [
                                        {id: 21, name: 'user-21', random: 4}
                                    ]}
                            ]},
                        {id: 2, name: 'project-2', tasks: []},
                        {id: 3, name: 'project-3', tasks: []}
                    ]);
                    break;

            }
        });

    step = 1;
    userOrds2.update({random: 50}, 10);

    step = 2;
    taskOrds2.detach(4, 'users', 10);
    //
    step = 3;
    userOrds2.add({id: 20, name: 'user-20', random: 500});
    taskOrds2.attach(4, 'users', 20);

    step = 4;
    userOrds2.add({id: 21, name: 'user-21', random: 4});
    taskOrds2.attach(1, 'users', 21);

    expect(steps_taken).toBe(5);
    done();
    subscription.unsubscribe();
});


// todo doesn't have test
