import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";

const ords = new Ords([
    {name: 'project', model: ProjectTest}
]);

const projectOrds = ords.use('project');

projectOrds.add([
    {id: 1, name: 'project-1', random: 30},
    {id: 2, name: 'project-2', random: 50},
    {id: 3, name: 'project-3', random: 20},
    {id: 4, name: 'project-4', random: 10},
    {id: 5, name: 'project-5', random: 40},
    {id: 6, name: 'project-6', random: null},
    {id: 7, name: 'project-7'},
]);

test('basic-where-statements', () => {
    // strict no results
    let projects = projectOrds.where('id', '===', 8).getStatic();
    expect(projects.length).toBe(0);
    expect(projects).toMatchObject([]);

    // strict 1 result
    projects = projectOrds.where('id', '===', 1).getStatic();
    expect(projects.length).toBe(1);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30}
    ]);

    // strict no results type difference
    projects = projectOrds.where('id', '===', '1').getStatic();
    expect(projects.length).toBe(0);
    expect(projects).toMatchObject([]);

    // loose 1 result
    projects = projectOrds.where('id', '==', '1').getStatic();
    expect(projects.length).toBe(1);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30}
    ]);

    // gather than
    projects = projectOrds.where('random', '>', 30).getStatic();
    expect(projects.length).toBe(2);
    expect(projects).toMatchObject([
        {id: 2, name: 'project-2', random: 50},
        {id: 5, name: 'project-5', random: 40},
    ]);

    // gather or equal than
    projects = projectOrds.where('random', '>=', 30).getStatic();
    expect(projects.length).toBe(3);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 2, name: 'project-2', random: 50},
        {id: 5, name: 'project-5', random: 40},
    ]);

    // smaller or equal than
    projects = projectOrds.where('random', '<', 30).getStatic();
    expect(projects.length).toBe(3);
    expect(projects).toMatchObject([
        {id: 3, name: 'project-3', random: 20},
        {id: 4, name: 'project-4', random: 10},
        {id: 6, name: 'project-6', random: null},
    ]);

    // smaller or equal than
    projects = projectOrds.where('random', '<=', 30).getStatic();
    expect(projects.length).toBe(4);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 3, name: 'project-3', random: 20},
        {id: 4, name: 'project-4', random: 10},
        {id: 6, name: 'project-6', random: null},
    ]);

    // where between
    projects = projectOrds.whereBetween('random', 20, 40).getStatic();
    expect(projects.length).toBe(3);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 3, name: 'project-3', random: 20},
        {id: 5, name: 'project-5', random: 40},
    ]);

    // where not between
    projects = projectOrds.whereNotBetween('random', 20, 40).getStatic();
    expect(projects.length).toBe(3);
    expect(projects).toMatchObject([
        {id: 2, name: 'project-2', random: 50},
        {id: 4, name: 'project-4', random: 10},
        {id: 6, name: 'project-6', random: null},
    ]);

    // where empty
    projects = projectOrds.whereEmpty('random').getStatic();
    expect(projects.length).toBe(2);
    expect(projects).toMatchObject([
        {id: 6, name: 'project-6', random: null},
        {id: 7, name: 'project-7'}
    ]);

    // where not empty
    projects = projectOrds.whereNotEmpty('random').getStatic();
    expect(projects.length).toBe(5);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 2, name: 'project-2', random: 50},
        {id: 3, name: 'project-3', random: 20},
        {id: 4, name: 'project-4', random: 10},
        {id: 5, name: 'project-5', random: 40}
    ]);

    // where not exists
    projects = projectOrds.whereNotExists('random').getStatic();
    expect(projects.length).toBe(1);
    expect(projects).toMatchObject([
        {id: 7, name: 'project-7'}
    ]);

    // where exists
    projects = projectOrds.whereExists('random').getStatic();
    expect(projects.length).toBe(6);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 2, name: 'project-2', random: 50},
        {id: 3, name: 'project-3', random: 20},
        {id: 4, name: 'project-4', random: 10},
        {id: 5, name: 'project-5', random: 40},
        {id: 6, name: 'project-6', random: null}
    ]);

    // where in
    projects = projectOrds.whereIn('random', [20, 40]).getStatic();
    expect(projects.length).toBe(2);
    expect(projects).toMatchObject([
        {id: 3, name: 'project-3', random: 20},
        {id: 5, name: 'project-5', random: 40},
    ]);

    // where not in
    projects = projectOrds.whereNotIn('random', [20, 40]).getStatic();
    expect(projects.length).toBe(4);
    expect(projects).toMatchObject([
        {id: 1, name: 'project-1', random: 30},
        {id: 2, name: 'project-2', random: 50},
        {id: 4, name: 'project-4', random: 10},
        {id: 6, name: 'project-6', random: null}
    ]);

    // or where todo fix
    projects = projectOrds
        .where('random', '=', 10)
        .orWhere('random', '=', 50)
        .getStatic();
    expect(projects.length).toBe(2);
    expect(projects).toMatchObject([
        {id: 2, name: 'project-2', random: 50},
        {id: 4, name: 'project-4', random: 10}
    ]);
});


// test('where-callback-statements', () => {
//     let projects = projectOrds.where((cb: WhereStatementCallback) => {
//         cb.
//     }).getStatic();
//     expect(projects.length).toBe(0);
//     expect(projects).toMatchObject([]);
// });



projectOrds.remove();
projectOrds.add([
    {id: 1, name: 'project-1', random: 30},
    {id: 2, name: 'project-2', random: 50},
    {id: 3, name: 'project-3', random: 20},
    {id: 4, name: 'project-4', random: 10},
    {id: 5, name: 'project-5', random: 40},
]);


test('where-statement-observable', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds
        .where('random', '>', 20)
        .get()
        .subscribe((projects) => {

            steps_taken ++;

            switch (step) {
                case 0:
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 2, name: 'project-2', random: 50},
                        {id: 5, name: 'project-5', random: 40},
                    ]);
                    break;
                case 1:
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 2, name: 'project-2', random: 50},
                        {id: 3, name: 'project-3', random: 60},
                        {id: 5, name: 'project-5', random: 40},
                    ]);
                    break;
                case 2:
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 3, name: 'project-3', random: 60},
                        {id: 5, name: 'project-5', random: 40},
                    ]);
                    break;
                case 3:
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 3, name: 'project-3', random: 60},
                        {id: 5, name: 'project-5', random: 40},
                        {id: 6, name: 'project-6', random: 70},
                    ]);
                    break;
                case 4:
                    // shouldn't fire
                    break;
            }
        });

    step = 1;
    projectOrds.update({random: 60}, 3);

    step = 2;
    projectOrds.update({random: 20}, 2);

    step = 3;
    projectOrds.add({id: 6, name: 'project-6', random: 70},);

    step = 4;
    projectOrds.add({id: 7, name: 'project-7', random: 10},);


    expect(steps_taken).toBe(4);
    done();
    subscription.unsubscribe();
});



