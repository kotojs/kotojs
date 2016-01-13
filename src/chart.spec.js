module.exports = Koto => {

  function throwError () {
    throw new Error('');
  }

  describe('koto.Base', function() {
    'use strict';

    before(function () {
      this.Test = class extends Koto {
        constructor(selection){
          super(selection);
          this.configs.width = {
            value: 500
          };
          this.configs.height = {
            value: 500
          };
          this.configs.color = {
            value: 'red'
          };

          this.accessor('value', function (d) {
            return d.value;
          });
          this.accessor('item', function (d) {
            return d.item;
          });
        }
      };
      this.test = new this.Test(d3.select('#test'));
      this.test2 = new this.Test(d3.select('#test2'));
    });

    describe('Attachments', function () {
      beforeEach(function () {
        this.myChart = new this.Test(d3.select('#test'));
        this.attachmentChart = new this.Test(d3.select('#test2'));
        sinon.spy(this.attachmentChart, 'draw');
      });

      describe('#attach', function () {
        it('should return the requested attachment', function () {
          var myAttachment = this.myChart.attach('myAttachment', this.attachmentChart);

          expect(this.myChart.attach('myAttachment')).to.equal(this.attachmentChart);
          expect(myAttachment).to.equal(this.attachmentChart);
        });

        it('should connect the specified chart', function (done) {
          var data = [13, 31];
          this.myChart.attach('myAttachment', this.attachmentChart);
          this.myChart.draw(data)
            .then(() => {
              expect(this.attachmentChart.draw.callCount).to.equal(1);
              expect(this.attachmentChart.draw.args[0].length).to.equal(1);
              expect(this.attachmentChart.draw.args[0][0]).to.deep.equal(data);
              done();
            }, throwError);

        });
      });

      describe('#demux', function () {
        var data = {
          series1: [1, 2, 3],
          series2: [4, 5, 6]
        };

        beforeEach(function () {
          this.attachmentChart2 = new this.Test(d3.select('#test2'));
          sinon.spy(this.attachmentChart2, 'draw');
          this.myChart.attach('attachment1', this.attachmentChart);
          this.myChart.attach('attachment2', this.attachmentChart2);
        });

        it('should use provided function to demultiplex the data', function (done) {
          this.myChart.demux = function(attachmentName, data) {
            if (attachmentName === 'attachment1') {
              return data.series1;
            }
            return data;
          };
          this.myChart.draw(data)
            .then(() => {
              expect(
                this.attachmentChart.draw.args,
                'Demuxes data passed to charts with registered function'
              ).to.deep.equal([[[1, 2, 3]]]);

              expect(
                this.attachmentChart2.draw.args[0][0].series1,
                data.series1,
                'Unmodified data passes through to attachments directly'
              ).to.deep.equal(data.series1);

              expect(
                this.attachmentChart2.draw.args[0][0].series2,
                data.series1,
                'Unmodified data passes through to attachments directly'
              ).to.deep.equal(data.series2);
              done();
            }, throwError);

        });

        it('should not run demux if it is not defined and not throw an error', function (done) {
          delete this.myChart.demux;
          this.myChart.draw(data)
            .then(() => {
              expect(
                this.attachmentChart2.draw.args[0][0].series1,
                data.series1,
                'Unmodified data passes through to attachments directly'
              ).to.deep.equal(data.series1);

              expect(
                this.attachmentChart2.draw.args[0][0].series2,
                data.series1,
                'Unmodified data passes through to attachments directly'
              ).to.deep.equal(data.series2);
              done();
            }, throwError);

        });
      });
    });

    describe('#postDraw / #postTransition', function () {
      beforeEach(function () {
        this.myChart = new this.Test(d3.select('#test'));

        this.myChart.postDraw = sinon.spy();
        this.spy = sinon.spy();

        this.layer1 = this.myChart.layer('layer1', this.myChart.base.append('g'), {
          dataBind: function(data) { return this.data(data); },
          insert: function() { return this.append('g'); }
        });

        this.layer1.on('merge:transition', function () {
          this.duration(250);
        });

        this.attachment1 = new this.Test(d3.select('#test'));

        this.layer2 = this.attachment1.layer('layer1', this.myChart.base.append('g'), {
          dataBind: function(data) { return this.data(data); },
          insert: function() { return this.append('g'); }
        });

        this.layer2.on('merge:transition', function () {
          this.duration(250);
        });

        this.myChart.attach('test1', this.attachment1);

      });

      it('should call postDraw after draw, regardless of transitions', function (done) {
        var self = this;
        setTimeout(() => {
          this.spy();
        }, 200);

        this.myChart.postTransition = sinon.spy(function () {
          expect(self.spy.calledAfter(self.myChart.postDraw)).to.be.true;
          done();
        });

        this.myChart.draw([1,2,3]);
      });

      it('should call postTransition when transitioned layers have finished rendering', function (done) {
        var self = this;
        setTimeout(() => {
          this.spy();
        }, 200);

        this.myChart.postTransition = sinon.spy(function () {
          expect(self.spy.calledBefore(self.myChart.postTransition)).to.be.true;
          done();
        });

        this.myChart.draw([1,2,3]);
      });
    });

    describe('#draw', function () {
      beforeEach(function () {
        var layer1, layer2, transform, transformedData, myChart;
        this.transformedData = transformedData = {};
        this.transform = transform = sinon.stub().returns(transformedData);
        this.myChart = myChart = new this.Test(d3.select('#test'));
        myChart.transform = transform;

        this.layer1 = layer1 = myChart.layer('layer1', myChart.base.append('g'), {
          dataBind: function(data) { return this.data(data); },
          insert: function() { return this.append('g'); }
        });
        sinon.spy(layer1, 'draw');
        this.layer2 = layer2 = myChart.layer('layer2', myChart.base.append('g'), {
          dataBind: function(data) { return this.data(data); },
          insert: function() { return this.append('g'); }
        });
        sinon.spy(layer2, 'draw');

        this.attachment1 = new this.Test(d3.select('#test'));
        this.attachment2 = new this.Test(d3.select('#test'));
        myChart.attach('test1', this.attachment1);
        myChart.attach('test2', this.attachment2);
        sinon.stub(this.attachment1, 'draw');
        sinon.stub(this.attachment2, 'draw');
      });

      it('should invoke the transform method once with the specified data', function (done) {
        var data = [1, 2, 3];
        expect(this.transform.callCount).to.equal(0);

        this.myChart.draw(data)
          .then(() => {
            expect(this.transform.callCount).to.equal(1);
            expect(this.transform.args[0][0]).to.equal(data);
            done();
          }, throwError);
      });

      it('should return a promise with transformed data', function (done) {
        var data = [1, 2, 3];
        this.myChart.draw(data)
          .then((transformed) => {
            expect(transformed).to.equal(this.transformedData);
            done();
          }, throwError);
      });

      it('should invoke the draw method for each of its layers', function (done) {
        expect(this.layer1.draw.callCount).to.equal(0);
        expect(this.layer2.draw.callCount).to.equal(0);

        this.myChart.draw([])
          .then(() => {
            expect(this.layer1.draw.callCount).to.equal(1);
            expect(this.layer2.draw.callCount).to.equal(1);
            done();
          }, throwError);

      });

      it('should invoke the `draw` method of each of its layers with the transformed data', function (done) {
        this.myChart.draw([])
          .then(() => {
            expect(this.layer1.draw.args[0][0]).to.equal(this.transformedData);
            expect(this.layer2.draw.args[0][0]).to.equal(this.transformedData);
            done();
          }, throwError);

      });

      it('should invoke the `draw` method on each of its attachments', function (done) {
        expect(this.attachment1.draw.callCount).to.equal(0);
        expect(this.attachment2.draw.callCount).to.equal(0);

        this.myChart.draw()
          .then(() => {
            expect(this.attachment1.draw.callCount).to.equal(1);
            expect(this.attachment2.draw.callCount).to.equal(1);
            done();
          }, throwError);

      });

      it('should invoke the `draw` method of each of its attachments with the transformed data', function (done) {
        this.myChart.draw()
          .then(() => {
            expect(this.attachment1.draw.args[0][0]).to.equal(this.transformedData);
            expect(this.attachment2.draw.args[0][0]).to.equal(this.transformedData);
            done();
          }, throwError);

      });

      it('should invoke the `draw` method of its layers before invoking the `draw` method of its attachments',
        function (done) {
          this.myChart.draw()
            .then(() => {
              expect(this.layer1.draw.calledBefore(this.attachment1.draw)).to.be.true;
              expect(this.layer1.draw.calledBefore(this.attachment2.draw)).to.be.true;
              expect(this.layer2.draw.calledBefore(this.attachment1.draw)).to.be.true;
              expect(this.layer2.draw.calledBefore(this.attachment2.draw)).to.be.true;
              done();
            }, throwError);

        });
      }
    );

    describe('#layer', function () {
      beforeEach(function () {
        var base = this.base = d3.select('#test');
        var chart = this.chart = new this.Test(d3.select('#test'));
        var layerbase = this.layerbase = base.append('g').classed('layer1', true);
        this.layer = chart.layer('testlayer', layerbase, {});
      });

      it('should return a layer', function () {
        expect(this.chart.layer('testlayer')).to.equal(this.layer);
      });

      it('should extend the selection with a `draw` method', function () {
        expect(typeof this.layer.draw).to.equal('function');
      });

      it('should extend the selection with an `on` method', function () {
        expect(typeof this.layer.on).to.equal('function');
      });

      it('should extend the selection with a `off` method', function () {
        expect(typeof this.layer.off).to.equal('function');
      });

      it('should re-attach layer when passed only two arguments', function () {
        var layer = this.chart.unlayer('testlayer');
        this.chart.layer('newLayer', layer);
        expect(this.chart.layer('newLayer')).to.equal(this.layer);
      });

      it('should throw an error when not passed a layer to re-attach', function () {
        this.chart.unlayer('testlayer');
        expect(function () {
          this.chart.layer('bad', {});
        }).to.throw(Error);
      });
    });

    describe('#unlayer', function () {
      beforeEach(function () {
        var base = this.base = d3.select('#test');
        var chart = this.chart = new this.Test(d3.select('#test'));
        var layerbase = this.layerbase = base.append('g').classed('layer1', true);
        this.layer = chart.layer('testlayer', layerbase, {});
      });

      it('should return a layer', function () {
        expect(this.chart.unlayer('testlayer')).to.equal(this.layer);
      });

      it('should delete layer from list', function () {
        this.chart.unlayer('testlayer');
        expect(this.chart._layers.has('testlayer')).to.be.false;
      });
    });

    describe('events', function () {
      beforeEach(function () {
        this.base = d3.select('#test');
        var chart = this.chart = new this.Test(this.base);

        var e1callback = this.e1callback = sinon.spy(function() {
          return this;
        });
        var e1callback2 = this.e1callback2 = sinon.spy(function() {
          return this.ctx;
        });
        var e2callback = this.e2callback = sinon.spy(function() {
          return this.ctx;
        });
        var onceCallback = this.onceCallback = sinon.spy(function() {
          return this.ctx;
        });

        var e1ctx = this.e1ctx = { ctx : 'ctx1' };
        var e2ctx = this.e2ctx = { ctx : 'ctx2' };

        chart.on('e1', e1callback);
        chart.on('e1', e1callback2, e1ctx);
        chart.on('e2', e2callback, e2ctx);
        chart.once('once', onceCallback);
      });

      describe('#trigger', function () {
        it('should execute callbacks', function () {
          this.chart.trigger('e1');
          expect(this.e1callback.callCount).to.equal(1);
          expect(this.e1callback2.callCount).to.equal(1);
          expect(this.e2callback.callCount).to.equal(0);

          this.chart.trigger('e2');

          expect(this.e2callback.callCount).to.equal(1);
        });

        it('should execute callbacks with correct context', function () {
          this.chart.trigger('e1');
          this.chart.trigger('e2');

          expect(this.e1callback.returnValues[0]).to.equal(this.chart);
          expect(this.e1callback2.returnValues[0]).to.equal(this.e1ctx.ctx);
          expect(this.e2callback.returnValues[0]).to.equal(this.e2ctx.ctx);
        });

        it('should pass parameters correctly', function () {
          this.chart.trigger('e1', 1, 2, 3);

          this.e1callback.calledWith(1,2,3);
        });

        it('should not fail when there are no callbacks', function () {
          var context = this;
          expect(function () {
            context.chart.trigger('non_existing_event', 12);
          }).not.to.throw(Error);
        });

        it('should return the chart instance (for chaining)', function (){
          expect(this.chart.trigger('e1')).to.equal(this.chart);
        });
      });

      describe('#on', function () {
        it('should return the chart instance (for chaining)', function () {
          expect(this.chart.on('e1')).to.equal(this.chart);
        });

        it('should fire everytime it is triggered.', function () {
          this.chart.trigger('e1');
          this.chart.trigger('e1');
          expect(this.e1callback.calledTwice).to.be.true;
        });
      });

      describe('#once', function () {
        it('should return the chart instance (for chaining)', function () {
          expect(this.chart.once('e1')).to.equal(this.chart);
        });

        it('should only be called once if triggered multiple times', function () {
          this.chart.trigger('once');
          this.chart.trigger('once');
          expect(this.onceCallback.calledOnce).to.be.true;
        });
      });

      describe('#off', function () {
        it('should remove all events when invoked without arguments', function () {
          this.chart.off();

          this.chart.trigger('e1');
          this.chart.trigger('e2');

          expect(this.e1callback.callCount).to.equal(0);
          expect(this.e1callback2.callCount).to.equal(0);
          expect(this.e2callback.callCount).to.equal(0);
        });

        it('should remove all events with the specified name', function () {
          this.chart.off('e1');
          this.chart.off('e2');

          this.chart.trigger('e1');
          this.chart.trigger('e2');

          expect(this.e1callback.callCount).to.equal(0);
          expect(this.e1callback2.callCount).to.equal(0);
          expect(this.e2callback.callCount).to.equal(0);
        });

        it('shouldremoves only event with specific callback', function() {
          this.chart.off('e1', this.e1callback2);

          this.chart.trigger('e1');
          this.chart.trigger('e2');

          expect(this.e1callback.callCount).to.equal(1);
          expect(this.e1callback2.callCount).to.equal(0);
          expect(this.e2callback.callCount).to.equal(1);
        });

        it('shouldremoves only event with specific context', function() {
          this.chart.off('e1', undefined, this.e1ctx);

          this.chart.trigger('e1');
          this.chart.trigger('e2');

          expect(this.e1callback.callCount).to.equal(1);
          expect(this.e1callback2.callCount).to.equal(0);
          expect(this.e2callback.callCount).to.equal(1);
        });

        it('shouldreturns the chart instance (chains)', function() {
          expect(this.chart.off('e1')).to.equal(this.chart);
        });
      });
    });

    describe('#config', function () {
      beforeEach(function () {
        this.myChart = new this.Test(d3.select('#test'));
      });

      it('should return list of configs if passed with no args', function () {
        this.myChart.config('color', 'blue');
        expect(this.myChart.config()).to.have.all.keys('color', 'width', 'height');
      });

      it('should get the specified default config value', function () {
        expect(this.myChart.config('width')).to.equal(500);
      });

      it('should set new config values', function () {
        this.myChart.config('color', 'blue');
        expect(this.myChart.config('color')).to.equal('blue');
      });

      it('should override exsisting config values', function () {
        this.myChart.config('width', 1000);
        expect(this.myChart.config('width')).to.equal(1000);
      });

      it('should throw error when trying to access non-existent config item', function () {
        expect(function () {
          this.myChart.config('nothing');
        }).to.throw(Error);
      });

      it('should set multiple config items when object is passed in', function () {
        this.myChart.config({
          width: 10,
          color: 'green'
        });

        expect(this.myChart.config('width')).to.equal(10);
        expect(this.myChart.config('color')).to.equal('green');
      });

      it('should calculate a percentage when a contriant boolean is passed in', function () {
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          constrain: true
        };

        this.myChart
          .config({
            width: 500,
            height: 500,
            'font-size': 12
          });

        expect(this.myChart.configs['font-size']).to.have.ownProperty('percentage');
      });

      it('should calculate a percentage when a contriant string is passed in', function () {
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          constrain: 'width'
        };

        this.myChart
          .config({
            width: 500,
            height: 500,
            'font-size': 12
          });

        expect(this.myChart.configs['font-size']).to.have.ownProperty('percentage');
      });

      it('should calculate a percentage when a contriant array is passed in', function () {
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          constrain: ['height', 'width']
        };

        this.myChart
          .config({
            width: 500,
            height: 500,
            'font-size': 12
          });

        expect(this.myChart.configs['font-size']).to.have.ownProperty('percentage');
      });

      it('should calculate a percentage when a contriant is passed in via key value pair of a config', function () {
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          constrain: true
        };

        this.myChart
          .config('font-size', 12);

        expect(this.myChart.configs['font-size']).to.have.ownProperty('percentage');
      });

      it('should not calculate percentage when no constraint is passed', function () {
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px'
        };

        this.myChart
          .config({
            width: 500,
            height: 500,
            'font-size': 12
          });

        expect(this.myChart.configs['font-size']).to.not.have.ownProperty('percentage');
      });

      it('should call getter when a getter is specified', function () {
        this.getter = sinon.spy(function () {return this.value; });
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          getter: this.getter
        };

        this.myChart.config('font-size');
        expect(this.getter.calledOnce).to.be.true;
      });

      it('should call setter when a accessing a config', function () {
        this.setter = sinon.spy(function (value) {return value; });
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          setter: this.setter
        };

        this.myChart.config('font-size', 14);
        expect(this.setter.calledOnce).to.be.true;
      });

      it('should call setter when a accessing a config passes in as object', function () {
        this.setter = sinon.spy(function (value) {return value; });
        this.myChart.configs['font-size'] = {
          description: 'font size for text',
          value: 12,
          units: 'px',
          setter: this.setter
        };

        this.myChart.config({
          'font-size': 14
        });
        expect(this.setter.calledOnce).to.be.true;
      });

      it('should console a warning if trying to set a config that is not defined: Object', function () {
        console.warn = sinon.spy();
        this.myChart.config({
          'bad': 14
        });
        expect(console.warn.calledOnce).to.be.true;
      });

      it('should console a warning if trying to set a config that is not defined: item/value', function () {
        console.warn = sinon.spy();
        this.myChart.config('bad', 14);
        expect(console.warn.calledOnce).to.be.true;
      });
    });

  describe('#accessor', function () {
      beforeEach(function () {
        this.myChart = new this.Test(d3.select('#test'));
      });

      it('should return list of accessors if passed with no args', function () {
        this.myChart.accessor('value', function (d) { return d.value; });
        expect(this.myChart.accessor()).to.have.any.keys(['value']);
      });

      it('should get the specified default config value', function () {
        expect(this.myChart.accessor('value')).to.exist;
      });

      it('should override exsisting config values', function () {
        var accessor = function (d) {
          return d[1];
        };
        this.myChart.accessor('item', accessor);
        expect(this.myChart.accessor('item')).to.equal(accessor);
      });

      it('should throw error when trying to access non-existent config item', function () {
        expect(function () {
          this.myChart.accessor('nothing');
        }).to.throw(Error);
      });

      it('should set multiple config items when object is passed in', function () {
        var func1 = function (d) { return d[0]; };
        var func2 = function (d) { return d[1]; };

        this.myChart.accessor({
          value: func1,
          item: func2
        });

        expect(this.myChart.accessor('value')).to.equal(func1);
        expect(this.myChart.accessor('item')).to.equal(func2);
      });

    });
  });

  describe('#merge', function () {
    beforeEach(function () {
      var func1 = this.func1 = function (d) {
        return d.value;
      };
      var func2 = this.func2 = function (d) {
        return d.item;
      };
      var func3 = this.func3 = function (d) {
        return d.name;
      };
      var func4 = this.func4 = function (d) {
        return d.category;
      };

      this.Chart1 = class extends Koto {
        constructor(selection){
          super(selection);
          this.configs.width = {
            value: 500
          };
          this.configs.color = {
            value: 'red'
          };

          this.accessor('value', func1);
          this.accessor('item', func2);

          this._nameGroup = this.base.append('g');
          this.layer('name', this._nameGroup, {
            dataBind: function  (d) {
              this.selectAll('g').data(d);
            },
            insert: function () {
              this.append('g');
            }
          });
        }
      };
      this.Chart2 = class extends Koto {
        constructor(selection){
          super(selection);
          this.configs.height = {
            value: 500
          };
          this.configs.fill = {
            value: 'red'
          };

          this.accessor('name', func3);
          this.accessor('category', func4);
        }
      };
      this.chart1 = new this.Chart1(d3.select('#test'));
      this.chart2 = new this.Chart2(d3.select('#test2'));
    });

    describe('extend', function () {
      it('should extend a chart when #extend method is passed a function', function () {

        var ExtendedChart = this.Chart1.extend(function () {
          this._titleGroup = this.base.append('g');

          this.layer('title', this._titleGroup, {
            dataBind: function  (d) {
              this.selectAll('g').data(d);
            },
            insert: function () {
              this.append('g');
            }
          });
        });

        var chart = new ExtendedChart(d3.select('#test'));
        expect(chart._layers.size).to.equal(2);
      });

      it('should extend a chart when #extend method is passed object', function () {

        var ExtendedChart = this.Chart1.extend({
          initialize: function () {
            this._titleGroup = this.base.append('g');

            this.layer('title', this._titleGroup, {
              dataBind: function  (d) {
                this.selectAll('g').data(d);
              },
              insert: function () {
                this.append('g');
              }
            });
          },
          transform: function (d) { return d; },
          test: function (d) { return d; }
        });

        var chart = new ExtendedChart(d3.select('#test'));
        expect(chart._layers.size).to.equal(2);
      });
    });

    describe('Koto.Layer', function () {

      it('should be exposed on Koto namespace', function () {
        expect(Koto.Layer).to.exist;
      });

      it('should be subclassable', function () {
        class OtherLayer extends Koto.Layer {
          extraMethod(){
            return true;
          }
        }
        var _layer = new OtherLayer(d3.select('#test2'), {
          dataBind(data) {
            return this.data(data);
          },
          insert() {
            this.append('span');
          }
        });

        var chart = new Koto(d3.select('#test'));

        expect(function () {
          chart.layer('test other layer', _layer);
        }).to.not.throw(Error);
      });
    });

    describe('configs', function () {
      it('should merge configs of two different charts using merge.config', function () {
        var myChart = new this.Chart1(d3.select('#test'));
        myChart.merge.configs(this.chart1.configs, this.chart2.configs);
        expect(myChart.config('height')).to.equal(500);
        expect(myChart.config('width')).to.equal(500);
        expect(myChart.config('color')).to.equal('red');
        expect(myChart.config('fill')).to.equal('red');
      });
    });

    describe('accessors', function () {
      it('should merge configs of two different charts using merge.config', function () {
        var myChart = new this.Chart1(d3.select('#test'));
        myChart.merge.accessors(this.chart1.accessors, this.chart2.accessors);
        expect(myChart.accessor('value')).to.equal(this.func1);
        expect(myChart.accessor('item')).to.equal(this.func2);
        expect(myChart.accessor('name')).to.equal(this.func3);
        expect(myChart.accessor('category')).to.equal(this.func4);
      });
    });
  });

};
