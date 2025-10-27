package com.rwtool.service;

import com.rwtool.model.Domain;
import com.rwtool.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DomainService {

    @Autowired
    private DomainRepository domainRepository;

    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    public Domain getDomainById(String id) {
        return domainRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Domain not found with id: " + id));
    }

    @Transactional
    public Domain addDomain(Domain domain) {
        // Check if domain with same name already exists
        if (domainRepository.existsByNameIgnoreCase(domain.getName())) {
            throw new RuntimeException("Domain with name '" + domain.getName() + "' already exists");
        }
        
        domain.setId(UUID.randomUUID().toString());
        return domainRepository.save(domain);
    }

    @Transactional
    public Domain updateDomain(String id, Domain domainDetails) {
        Domain domain = getDomainById(id);
        
        // Check if new name conflicts with existing domain
        if (!domain.getName().equalsIgnoreCase(domainDetails.getName()) && 
            domainRepository.existsByNameIgnoreCase(domainDetails.getName())) {
            throw new RuntimeException("Domain with name '" + domainDetails.getName() + "' already exists");
        }
        
        domain.setName(domainDetails.getName());
        domain.setDescription(domainDetails.getDescription());
        return domainRepository.save(domain);
    }

    @Transactional
    public void deleteDomain(String id) {
        Domain domain = getDomainById(id);
        domainRepository.delete(domain);
    }
}
