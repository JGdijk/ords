import {Ords} from "../src/ords";
import {ProjectTest} from "./helpers/models/project-test";

const ords = new Ords([
    {name: 'project', model: ProjectTest}
]);

const ords2 = new Ords([
    {name: 'project', model: ProjectTest}
]);

const projectOrds = ords.use('project');
const projectOrds2 = ords2.use('project');

projectOrds.add([
    {id: 1, name: 'project-1'},
    {id: 2, name: 'project-2'},
    {id: 3, name: 'project-3'}
]);

projectOrds2.add([
    {id: 1, name: 'project-1'},
    {id: 2, name: 'project-2'},
    {id: 3, name: 'project-3'}
]);

test('model', done => {
    let p = null;
    let p2 = null;

    let step = 0;
    let step1_taken = 0;
    let step2_taken = 0;

    let subscription = projectOrds.get().subscribe((projects) => {
        console.log(projects);
        step1_taken ++;
        p = projects;

        expect(projects.length).toBe(3);

        switch (step) {
            case 0:
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 1:
                expect(projects).toMatchObject([
                    {id: 1, name: 'test'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 2:
                // nothing;
                break;
            case 3:
                // nothing;
                break;
        }


    });
    let subscription2 = projectOrds2.get().subscribe((projects) => {
        step2_taken ++;
        p2 = projects;

        expect(projects.length).toBe(3);

        switch (step) {
            case 0:
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 1:
                // nothing;
                break;
            case 2:
                expect(projects).toMatchObject([
                    {id: 1, name: 'test2'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 3:
                expect(projects).toMatchObject([
                    {id: 1, name: 'test2'},
                    {id: 2, name: 'test3'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
        }

    });

    step = 1;
    p[0].update({name:'test'});
    step = 2;
    p2[0].update({name:'test2'});
    step = 3;
    p2[1].update({name:'test3'});

    expect(step1_taken).toBe(2);
    expect(step2_taken).toBe(3);

    done();
    subscription.unsubscribe();
    subscription2.unsubscribe();
});

test('model-function-inheritance', () => {
    expect(projectOrds.findStatic(1).testFunction()).toBe('test');
});

