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
]);

test('where-statement-observable', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds
        .where('random', '>', 20)
        .get()
        .subscribe((projects) => {
console.log(projects);
            switch (step) {
                case 0:
                    console.log(0);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 2, name: 'project-2', random: 50},
                        {id: 5, name: 'project-5', random: 40},
                    ]);
                    steps_taken ++;
                    break;
                case 1:
                    console.log(1);
                    expect(projects).toMatchObject([
                        {id: 1, name: 'project-1', random: 30},
                        {id: 2, name: 'project-2', random: 50},
                        {id: 3, name: 'project-3', random: 60},
                        {id: 5, name: 'project-5', random: 40},
                    ]);
                    steps_taken ++;
                    break;
                case 2:
                    console.log(2);
                    // expect(projects).toMatchObject([
                    //     {id: 1, name: 'project-1', random: 30},
                    //     {id: 3, name: 'project-3', random: 60},
                    //     {id: 5, name: 'project-5', random: 40},
                    // ]);
                    steps_taken ++;
                    break;
            }
        });

    step = 1;
    projectOrds.update({random: 60}, 3);

    step = 2;
    projectOrds.update({random: 20}, 2);


    expect(steps_taken).toBe(3);
    done();
    subscription.unsubscribe();
});