// counting the amount of objects.
import {testProjectRds} from "./helpers/helper";

// add 1 item
test('simple-add-observable', done => {

    let step = 0;
    let subscription = testProjectRds.get().subscribe((projects) => {

        switch(step) {
            case 0:
                expect(projects.length).toBe(3);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'}
                ]);
                break;
            case 1:
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4'}
                ]);
                break;
            case 2:
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4'}
                ]);
                break;
            case 3:
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'project-2'},
                    {id: 3, name: 'project-3'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 4:
                expect(projects.length).toBe(4);
                expect(projects).toMatchObject([
                    {id: 1, name: 'project-1a'},
                    {id: 2, name: 'similar_name'},
                    {id: 3, name: 'similar_name'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 5:
                expect(projects.length).toBe(3);
                expect(projects).toMatchObject([
                    {id: 2, name: 'similar_name'},
                    {id: 3, name: 'similar_name'},
                    {id: 4, name: 'project-4a'}
                ]);
                break;
            case 6:
                expect(projects.length).toBe(1);
                break;
        }

    });

    step = 1;
    testProjectRds.add({id: 4, name: 'project-4'});

    step = 2;
    testProjectRds.where('id', '=', 1).update({name: 'project-1a'});

    step = 3;
    testProjectRds.where('id', '=', 4).update({name: 'project-4a'});

    step = 4;
    testProjectRds.whereBetween('id', 2, 3).update({name: 'similar_name'});

    step = 5;
    testProjectRds.remove(1); // todo change remove to query + add removeIds()

    step = 6;
    testProjectRds.remove([2,3,4]); // todo change remove to query + add removeIds()

    done();
    subscription.unsubscribe();
});