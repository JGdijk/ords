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
                    // shoudn't fire
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

