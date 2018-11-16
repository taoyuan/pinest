import {assert} from "chai";
import {expose, fetchExposes} from "../src/exposes";

class ExposesTest {

  @expose()
  n1: number;

  n11: number;

  @expose()
  a() {
    console.log('a');
  }


  b() {
    console.log('a');
  }

  @expose()
  c() {
    console.log('c');
  }

}

class ExtendedExposeTest extends ExposesTest {

  @expose()
  n2: number;

  n21: number;

  @expose()
  d() {
    console.log('d')
  }
}

const ExpectedExposes = ['n2', 'd', 'n1', 'a', 'c'];

describe('exposes', () => {
  it('should fetch all tags from class', () => {
    assert.deepEqual(fetchExposes(ExtendedExposeTest), ExpectedExposes);
  });

  it('should fetch all tags from instance', () => {
    assert.deepEqual(fetchExposes(new ExtendedExposeTest()), ExpectedExposes);
  });
});
