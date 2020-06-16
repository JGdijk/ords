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


test('simple-add-observable', done => {

    let step = 0;
    let steps_taken = 0;

    let subscription = projectOrds.get().subscribe((projects) => {

        switch(step) {
            case 0:
                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 1:
                steps_taken ++;
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4'}
                ]);
                break;
            case 2:
                steps_taken ++;
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4'}
                ]);
                break;
            case 3:
                steps_taken ++;
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 4:
                steps_taken ++;
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'similar_name'},
                    {id: 3, name: 'similar_name'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 5:
                steps_taken ++;
                expect(projects.length).toBe(3);
                expect(projects).toMatchObject([
                    {id: 2, name: 'similar_name'},
                    {id: 3, name: 'similar_name'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 6:
                steps_taken ++;
                expect(projects.length).toBe(0);
                break;
            case 7:
                steps_taken ++;
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4'}
                ]);
        }

    });

    step = 1;
    projectOrds.add({id: 4, name: 'project-4'});

    step = 2;
    projectOrds.where('id', '===', 1).update({name: 'project-1a'});

    step = 3;
    projectOrds.where('id', '===', 4).update({name: 'project-4a'});

    step = 4;
    projectOrds.whereBetween('id', 2, 3).update({name: 'similar_name'});

    step = 5;
    projectOrds.remove(1);

    step = 6;
    projectOrds.remove([2,3,4]);


    step = 7;
    ords.hold();
    projectOrds.add({id: 1, name: 'project-1'});
    projectOrds.add({id: 2, name: 'project-2'});
    projectOrds.add({id: 3, name: 'project-3'});
    projectOrds.add({id: 4, name: 'project-4'});
    ords.continue();

    expect(steps_taken).toBe(8);

    done();
    subscription.unsubscribe();
});
