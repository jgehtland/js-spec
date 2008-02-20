require 'rake'
require 'rake/packagetask'

SPEC_ROOT     = File.expand_path(File.dirname(__FILE__))
SPEC_SRC_DIR  = File.join(SPEC_ROOT, 'src')
SPEC_DIST_DIR = File.join(SPEC_ROOT, 'dist')
SPEC_VERSION  = '0.2.2'

task :default => [:dist, :package, :clean_package_source]

task :dist do
  $:.unshift File.join(SPEC_ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(SPEC_SRC_DIR) do
    File.open(File.join(SPEC_DIST_DIR, "jsspec.js"), 'w') do |dist|
      dist << Protodoc::Preprocessor.new("jsspec.js")
    end
  end
end

Rake::PackageTask.new('js_spec', SPEC_VERSION) do |package|
  package.need_tar_gz = true
  package.need_zip = true
  package.package_dir = SPEC_DIST_DIR
  package.package_files.include(
    '[A-Z]*',
    "dist/jsspec.js",
    'lib/**',
    'src/**/**',
    'spec/**'
  )
end
task :clean_package_source do
  rm_rf File.join(SPEC_DIST_DIR, "jsspec-#{SPEC_VERSION}")
end
