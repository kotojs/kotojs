// Experimental, not used yet.

class Config {
  constructor(config) {
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.value = config.value;
    this.type = 'string';
  }
  getter () {
    return this.value;
  }
  setter (value) {
    this.value = value;
    return this;
  }
}

class NumberConfig extends Config {
  constructor(config) {
    super(config);
    this.value = config.value;
    this.units = config.units || 'px';
    this.type = 'number';
  }
}

class BooleanConfig extends Config {
  constructor(config) {
    super(config);
    this.value = config.value || false;
    this.type = 'boolean';
  }
}

class ColorConfig extends Config {
  constructor(config) {
    super(config);
    this.value = config.value;
    this.type = 'color';
  }
}

export {
  Config,
  NumberConfig,
  BooleanConfig,
  ColorConfig
};